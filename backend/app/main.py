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

@asynccontextmanager
async def lifespan(app: FastAPI):
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

# CORS configuration
# Using specific origins instead of '*' when allow_credentials=True
origins = [
    "http://localhost:3000", # Local development
    "https://smart-credit-70mgoz6de-ghulam-mustafa-katbars-projects.vercel.app", # Vercel preview
    "https://smartcredit-ai.vercel.app", # Vercel production (example)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
@limiter.limit("5/minute")
def health_check(request: Request):
    return {"status": "ok"}


