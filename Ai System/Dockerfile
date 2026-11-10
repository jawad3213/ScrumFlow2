# AI service (FastAPI + Uvicorn) on port 8001, behind nginx at /ai/.
FROM python:3.12-slim

WORKDIR /app

# No .pyc files in the image, logs flushed immediately
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Dependencies first, in their own cached layer (PyMuPDF installs from a prebuilt wheel: no compiler needed)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Unprivileged user; uploaded PDFs are written to /tmp while they are read
RUN useradd --system --no-create-home app
USER app

# Settings (AI_CORS_ALLOWED_ORIGINS) come from the environment: env_file / docker-compose, no defaults here
EXPOSE 8001

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8001/health', timeout=4)" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
