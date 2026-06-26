import os
import sys

# MUST be set BEFORE any imports that touch pydantic Settings
POOLER_URL = "postgresql://postgres.meiybbpcneynddjwzrcy:dJoVNBJbUPFm0FKd@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
os.environ["DATABASE_URL"] = POOLER_URL

# Change to backend dir so alembic.ini is found
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

from alembic.config import Config
from alembic import command

print(f"Running Alembic migrations...")
print(f"Target host: aws-1-ap-northeast-2.pooler.supabase.com:5432")
alembic_cfg = Config("alembic.ini")
command.upgrade(alembic_cfg, "head")
print("All migrations completed successfully! Tables are created.")
