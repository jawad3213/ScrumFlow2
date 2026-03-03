import os
import sys
import shutil
import fitz  # PyMuPDF
import json

# Force UTF-8 output on Windows (prevents UnicodeEncodeError from emoji/special chars in AI responses)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from services.staffing_service import generer_plan_staffing
from schemas.staffing_schemas import ProjectFinancialPlan
from services.backlog_service import analyser_cahier_des_charges_staffing
from schemas.backlog_schemas import RapportAnalyseStaffing
from services.stackchoice_service import generate_stack_recommendation
from schemas.stackchoice_schemas import ArchitectureAnalysisResponse

app = FastAPI()

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-staffing")
async def analyze_staffing(
    file: UploadFile = File(...),
    pool_employes: str = Form(..., description="JSON contenant la liste des employés et leurs salaires"),
    api_key: str = Form(...),
):
    """
    Direct endpoint: PDF -> Text -> Staffing/Financial Plan (without intermediate Backlog steps)
    """
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")
        
    try:
        # 1. Save temp file
        import uuid
        temp_filename = f"temp_{uuid.uuid4().hex}.pdf"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Extract text from PDF
        try:
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
    api_key: str = Form(...),
):
    """
    Endpoint: PDF + Constraints -> Backlog with Assigned Tasks
    """
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")

    try:
        # 1. Save temp file
        import uuid
        temp_filename = f"temp_backlog_{uuid.uuid4().hex}.pdf"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Extract text from PDF
        try:
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
    api_key: str = Form(...),
):
    """
    Endpoint: Backlog JSON -> Architecture & Tech Stack Recommendations
    """
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")

    try:
        # Read the uploaded JSON file content
        content_bytes = await file.read()
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
