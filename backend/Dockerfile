FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (e.g. for psycopg2)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Pre-install heavy ML packages so Docker caches this layer if successful
RUN pip install --default-timeout=1000 --retries=10 --no-cache-dir xgboost scikit-learn pandas numpy shap

# Install the rest of the backend requirements
RUN pip install --default-timeout=1000 --retries=10 --no-cache-dir -r requirements.txt

COPY . .

CMD gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}
