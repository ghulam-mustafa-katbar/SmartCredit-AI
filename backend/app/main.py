from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api.api_v1.api import api_router
from app.core.config import settings
from app.core.ml_model import ml_engine

limiter = Limiter(key_func=get_remote_address)

from urllib.parse import urlparse
from app.core.database import check_db_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Parse and log database host for debugging Supabase connection issues
    parsed_db = urlparse(settings.DATABASE_URL)
    logger.info(f"Starting up. Configured Database Host: {parsed_db.hostname}, Port: {parsed_db.port}")
    
    if "pooler.supabase.com" not in str(parsed_db.hostname):
        logger.warning("WARNING: You are NOT using the Supabase Connection Pooler! If deployed on Render, direct connections to db.*.supabase.co will fail because Supabase deprecated IPv4. Please update DATABASE_URL to use the Connection Pooler (aws-0-*.pooler.supabase.com).")
        
    db_ok = await check_db_connection()
    if not db_ok:
        logger.error("Failed to connect to the database on startup. Endpoints that require DB access will fail.")

    # Load the ML model on startup
    ml_engine.load_models()
    yield
    # Clean up on shutdown
    ml_engine.model = None

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Alternative Credit Assessment Platform API",
    version="1.0.0",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

import logging
import time
from fastapi.responses import JSONResponse

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    origin = request.headers.get("origin", "unknown")
    logger.info(f"Incoming request: {request.method} {request.url.path} from Origin: {origin}")
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(f"Completed {response.status_code} OK in {process_time:.2f}s")
    return response

# CORS configuration
origins = settings.get_allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler to ensure CORS headers are returned on 500 Internal Server Errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    origin = request.headers.get("origin")
    
    headers = {}
    if origin:
        # Check if origin is allowed
        if origin in origins or "vercel.app" in origin:
            headers["Access-Control-Allow-Origin"] = origin
            headers["Access-Control-Allow-Credentials"] = "true"
            
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "message": str(exc)},
        headers=headers
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
@limiter.limit("5/minute")
def health_check(request: Request):
    return {"status": "ok"}


