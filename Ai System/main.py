import os
import sys
import tempfile
import fitz  # PyMuPDF
import json
from dotenv import load_dotenv

# Settings live in "Ai System/.env" (see .env.example), with no fallback in the code.
# Real environment variables (Docker) win over the file.
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))


def required_env(name: str) -> str:
    """The variable's value (possibly empty); stops the service when it is not defined at all."""
    value = os.environ.get(name)
    if value is None:
        raise RuntimeError(f"{name} is not set: define it in 'Ai System/.env' (see .env.example)")
    return value


# Force UTF-8 output on Windows (prevents UnicodeEncodeError from emoji/special chars in AI responses)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from prometheus_fastapi_instrumentator import Instrumentator
from services.staffing_service import generer_plan_staffing
from schemas.staffing_schemas import ProjectFinancialPlan
from services.backlog_service import analyser_cahier_des_charges_staffing
from schemas.backlog_schemas import RapportAnalyseStaffing
from services.stackchoice_service import generate_stack_recommendation
from schemas.stackchoice_schemas import ArchitectureAnalysisResponse

app = FastAPI()

# Behind nginx (Docker, production) the frontend is same-origin and CORS is not used.
# Only local development without nginx (Vite on :5173 calling :8001 directly) needs it.
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in required_env("AI_CORS_ALLOWED_ORIGINS").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Request count and latency per endpoint at /metrics, scraped by Prometheus over the Docker network.
# nginx refuses /ai/metrics from outside (frontend/nginx/scrumflow-locations.conf).
# Gemini calls take tens of seconds, so the per-endpoint latency buckets go up to 5 minutes
# (nginx's proxy_read_timeout for /ai/); the library's default stops at 1 second.
Instrumentator(
    excluded_handlers=["/health", "/metrics"],
    should_instrument_requests_inprogress=True,
    inprogress_labels=True,
).instrument(
    app,
    latency_lowr_buckets=(0.5, 1, 2.5, 5, 10, 20, 30, 45, 60, 90, 120, 180, 300),
).expose(app, include_in_schema=False)

# Same limit as nginx's client_max_body_size for /ai/
MAX_UPLOAD_BYTES = 20 * 1024 * 1024


def save_upload(file: UploadFile, path: str):
    """Copies the upload to disk, refusing files above MAX_UPLOAD_BYTES."""
    written = 0
    with open(path, "wb") as buffer:
        while chunk := file.file.read(1024 * 1024):
            written += len(chunk)
            if written > MAX_UPLOAD_BYTES:
                raise HTTPException(status_code=413, detail="File too large (max 20 MB).")
            buffer.write(chunk)

@app.get("/health")
async def health():
    """Liveness probe for the Docker healthcheck (no dependency is called)."""
    return {"status": "ok"}


@app.post("/analyze-staffing")
async def analyze_staffing(
    file: UploadFile = File(...),
    pool_employes: str = Form(..., description="JSON contenant la liste des employés et leurs salaires"),
    api_key: str = Form(""),  # empty is answered below with a clear 400, not FastAPI's 422
):
    """
    Direct endpoint: PDF -> Text -> Staffing/Financial Plan (without intermediate Backlog steps)
    """
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")
        
    try:
        # 1. Save temp file
        import uuid
        temp_filename = os.path.join(tempfile.gettempdir(), f"temp_{uuid.uuid4().hex}.pdf")

        # 2. Extract text from PDF
        try:
            save_upload(file, temp_filename)
            doc = fitz.open(temp_filename)
            text_content = chr(12).join([page.get_text() for page in doc])
            doc.close()
        finally:
            # Always ensure cleanup
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
        
        if not text_content.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from PDF. It might be empty or scanned images.")

        # 3. Generate Staffing Plan directly from text
        result: ProjectFinancialPlan = generer_plan_staffing(
            project_text=text_content, 
            employee_pool=pool_employes, 
            api_key=api_key
        )
        
        output_dict = result.model_dump()
        print("\n=== GEMINI DIRECT STAFFING RESPONSE ===")
        print(json.dumps(output_dict, indent=2))
        print("=======================================\n")
        
        return output_dict

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        try:
            print(f"FAILED Analysis Error:\n{error_traceback}")
        except UnicodeEncodeError:
            print(error_traceback.encode("utf-8", errors="replace").decode("utf-8"))
        detail_msg = f"[{type(e).__name__}] {str(e)}"
        raise HTTPException(status_code=500, detail=detail_msg)

@app.post("/analyze-backlog")
async def analyze_backlog(
    file: UploadFile = File(...),
    pool_employes: str = Form(..., description="JSON employee pool"),
    dev_duration_months: float = Form(..., description="Project duration in months"),
    total_budget: float = Form(..., description="Total project budget"),
    api_key: str = Form(""),  # empty is answered below with a clear 400, not FastAPI's 422
):
    """
    Endpoint: PDF + Constraints -> Backlog with Assigned Tasks
    """
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")

    try:
        # 1. Save temp file
        import uuid
        temp_filename = os.path.join(tempfile.gettempdir(), f"temp_backlog_{uuid.uuid4().hex}.pdf")

        # 2. Extract text from PDF
        try:
            save_upload(file, temp_filename)
            doc = fitz.open(temp_filename)
            text_content = chr(12).join([page.get_text() for page in doc])
            doc.close()
        finally:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)

        if not text_content.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        # 3. Generate Backlog
        result: RapportAnalyseStaffing = analyser_cahier_des_charges_staffing(
            text_content=text_content, 
            employee_pool=pool_employes,
            dev_duration_months=dev_duration_months,
            total_budget=total_budget,
            api_key=api_key
        )

        output_dict = result.model_dump()
        print("\n=== GEMINI BACKLOG RESPONSE ===")
        print(json.dumps(output_dict, indent=2))
        print("===============================\n")

        return output_dict

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        try:
            print(f"FAILED Backlog Analysis Error:\n{error_traceback}")
        except UnicodeEncodeError:
            print(error_traceback.encode("utf-8", errors="replace").decode("utf-8"))
        detail_msg = f"[{type(e).__name__}] {str(e)}"
        raise HTTPException(status_code=500, detail=detail_msg)

@app.post("/analyze-stack")
async def analyze_stack(
    file: UploadFile = File(..., description="JSON file containing the project backlog"),
    api_key: str = Form(""),  # empty is answered below with a clear 400, not FastAPI's 422
):
    """
    Endpoint: Backlog JSON -> Architecture & Tech Stack Recommendations
    """
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")

    try:
        # Read the uploaded JSON file content
        content_bytes = await file.read(MAX_UPLOAD_BYTES + 1)
        if len(content_bytes) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="File too large (max 20 MB).")
        try:
            backlog_content = content_bytes.decode("utf-8")
            # Quick validation that it is at least loadable json (optional but good practice)
            json.loads(backlog_content) 
        except Exception:
             raise HTTPException(status_code=400, detail="Invalid JSON file provided.")

        if not backlog_content.strip():
             raise HTTPException(status_code=400, detail="Backlog file is empty.")

        # 3. Generate Stack Recommendation
        result: ArchitectureAnalysisResponse = generate_stack_recommendation(
            backlog_json=backlog_content, 
            api_key=api_key
        )

        output_dict = result.model_dump()
        print("\n=== GEMINI STACK RESPONSE ===")
        print(json.dumps(output_dict, indent=2))
        print("=============================\n")

        return output_dict

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        try:
            print(f"FAILED Stack Analysis Error:\n{error_traceback}")
        except UnicodeEncodeError:
            print(error_traceback.encode("utf-8", errors="replace").decode("utf-8"))
        detail_msg = f"[{type(e).__name__}] {str(e)}"
        raise HTTPException(status_code=500, detail=detail_msg)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
