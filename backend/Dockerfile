FROM python:3.12-slim

WORKDIR /app

# Copy requirements first (Docker layer caching)
COPY requirements.txt .

# Install heavy ML packages sequentially using --prefer-binary.
# This prevents pip from running out of memory (OOM) on resource-constrained build servers.
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefer-binary numpy==1.26.4 && \
    pip install --no-cache-dir --prefer-binary pandas==2.2.1 && \
    pip install --no-cache-dir --prefer-binary scikit-learn==1.4.1.post1 && \
    pip install --no-cache-dir --prefer-binary xgboost==2.0.3 && \
    pip install --no-cache-dir --prefer-binary shap==0.45.0

# Install remaining backend requirements
RUN pip install --no-cache-dir --prefer-binary -r requirements.txt

# Copy all backend source code
COPY . .

# Create startup script (set -e ensures alembic failure stops deployment)
RUN printf '#!/bin/bash\nset -e\necho "[Startup] Running database migrations..."\nalembic upgrade head\necho "[Startup] Starting Gunicorn server..."\nexec gunicorn app.main:app \\\n  --workers 1 \\\n  --worker-class uvicorn.workers.UvicornWorker \\\n  --bind 0.0.0.0:${PORT:-8000} \\\n  --timeout 120 \\\n  --log-level info\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
