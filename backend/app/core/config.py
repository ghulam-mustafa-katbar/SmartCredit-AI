import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartCredit AI"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_jwt_key_replace_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres%2Emeiybbpcneynddjwzrcy:wdIgH0oEW97onJME@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # CORS Origins
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://smart-credit-ai-one.vercel.app")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "https://smart-credit-ai-one.vercel.app,https://smart-credit-ai-pearl.vercel.app,http://localhost:3000")
    
    @property
    def get_allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        # Replace sync driver with async driver for SQLAlchemy async engine
        url = self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
        # asyncpg uses ?ssl=require instead of ?sslmode=require
        url = url.replace("?sslmode=require", "")
        if "pooler.supabase.com" in url and "ssl" not in url:
            url = url + "?ssl=true"
        return url

    class Config:
        case_sensitive = True

settings = Settings()
