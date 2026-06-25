import logging
import time
from contextlib import asynccontextmanager
from urllib.parse import urlparse

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.api.api_v1.api import api_router
from app.core.config import settings
from app.core.database import check_db_connection
from app.core.ml_model import ml_engine

# ── Logging setup (MUST be before any usage of logger) ──────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Rate limiter ─────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)


# ── Application lifespan (startup / shutdown) ────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Log configured database host to help debug connection issues
    parsed_db = urlparse(settings.DATABASE_URL)
    logger.info(
        f"Starting up. Database Host: {parsed_db.hostname}, Port: {parsed_db.port}"
    )

    if "pooler.supabase.com" not in str(parsed_db.hostname or ""):
        logger.warning(
            "WARNING: Not using Supabase Connection Pooler. "
            "Direct connections to db.*.supabase.co fail on Render (IPv6 only). "
            "Set DATABASE_URL to the Session Pooler URL."
        )

    # Test database connection on startup
    db_ok = await check_db_connection()
    if not db_ok:
        logger.error(
            "Database connection failed on startup. "
            "Endpoints requiring DB will return 500."
        )

    # Load ML model on startup (non-fatal if missing)
    ml_engine.load_models()

    yield  # Application runs here

    # Shutdown cleanup
    ml_engine.model = None
    logger.info("Application shutdown complete.")


# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Alternative Credit Assessment Platform API",
    version="1.0.0",
    lifespan=lifespan,
)

# ── Rate limiting ─────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS middleware ───────────────────────────────────────────────────────────
# Must be added BEFORE routes and other middleware
origins = settings.get_allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request logging middleware ────────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    origin = request.headers.get("origin", "unknown")
    logger.info(
        f"→ {request.method} {request.url.path} | Origin: {origin}"
    )
    response = await call_next(request)
    elapsed = time.time() - start_time
    logger.info(f"← {response.status_code} ({elapsed:.2f}s)")
    return response


# ── Global exception handler (ensures CORS headers on 500 errors) ─────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    origin = request.headers.get("origin")
    headers = {}
    if origin and ("vercel.app" in origin or origin in origins):
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "message": str(exc)},
        headers=headers,
    )


# ── API routes ────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_STR)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
@limiter.limit("30/minute")
def health_check(request: Request):
    return {"status": "ok"}
