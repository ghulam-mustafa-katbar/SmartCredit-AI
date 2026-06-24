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
# Run database migrations and then start the server with 1 worker to prevent OOM on Render free tier
CMD alembic upgrade head && gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}
