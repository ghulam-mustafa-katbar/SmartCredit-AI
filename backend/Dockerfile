FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker layer caching)
COPY requirements.txt .

# Pre-install heavy ML packages so Docker caches this layer separately
RUN pip install --default-timeout=1000 --retries=10 --no-cache-dir \
    xgboost scikit-learn pandas numpy shap

# Install remaining backend requirements
RUN pip install --default-timeout=1000 --retries=10 --no-cache-dir -r requirements.txt

# Copy all backend source code
COPY . .

# Create startup script (set -e ensures alembic failure stops deployment)
RUN printf '#!/bin/bash\nset -e\necho "[Startup] Running database migrations..."\nalembic upgrade head\necho "[Startup] Starting Gunicorn server..."\nexec gunicorn app.main:app \\\n  --workers 1 \\\n  --worker-class uvicorn.workers.UvicornWorker \\\n  --bind 0.0.0.0:${PORT:-8000} \\\n  --timeout 120 \\\n  --log-level info\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
