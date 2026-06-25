FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Pre-install heavy ML packages (cached as a separate layer)
RUN pip install --default-timeout=1000 --retries=10 --no-cache-dir \
    xgboost scikit-learn pandas numpy shap

# Install remaining requirements
RUN pip install --default-timeout=1000 --retries=10 --no-cache-dir -r requirements.txt

COPY . .

# Create startup script so CMD failures are properly reported
RUN echo '#!/bin/bash\nset -e\necho "Running database migrations..."\nalembic upgrade head\necho "Starting server..."\nexec gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}' > /app/start.sh \
    && chmod +x /app/start.sh

CMD ["/app/start.sh"]
