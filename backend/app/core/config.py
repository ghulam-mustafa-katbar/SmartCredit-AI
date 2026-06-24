import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartCredit AI"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_jwt_key_replace_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/smartcredit")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # CORS Origins
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://smart-credit-ai-one.vercel.app")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "https://smart-credit-ai-one.vercel.app,https://smart-credit-ai-pearl.vercel.app,http://localhost:3000")
    
    @property
    def get_allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

    class Config:
        case_sensitive = True

settings = Settings()
