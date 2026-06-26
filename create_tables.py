"""
Direct table creation script using SQLAlchemy - bypasses Alembic config entirely.
Uses the Supabase Session Pooler URL (IPv4, works on Render).
"""
import os
import sys

# Set environment BEFORE any imports
POOLER_URL = "postgresql://postgres.meiybbpcneynddjwzrcy:dJoVNBJbUPFm0FKd@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
os.environ["DATABASE_URL"] = POOLER_URL

# Add backend to path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
sys.path.insert(0, backend_dir)

from sqlalchemy import create_engine, text

print(f"Connecting to: aws-1-ap-northeast-2.pooler.supabase.com:5432")
engine = create_engine(POOLER_URL + "?sslmode=require")

# Test connection first
try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        version = result.fetchone()[0]
        print(f"✅ Connected! PostgreSQL version: {version[:60]}")
except Exception as e:
    print(f"❌ Connection FAILED: {e}")
    sys.exit(1)

# Import all models and create tables
print("Importing models...")
from app.models import *
from app.core.database import Base

print("Creating all tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    
    # List created tables
    with engine.connect() as conn:
        result = conn.execute(text(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
        ))
        tables = [row[0] for row in result]
        print(f"✅ Tables in database: {tables}")
except Exception as e:
    print(f"❌ Table creation FAILED: {e}")
    sys.exit(1)

print("\n🎉 Database is fully set up and ready!")
