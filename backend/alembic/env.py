from logging.config import fileConfig
from sqlalchemy import create_engine
from sqlalchemy import pool
from alembic import context
import os
import sys

# Add backend directory to sys.path so app.* imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import all models so Alembic can detect schema changes
from app.models import *  # noqa: F401, E402
from app.core.database import Base

target_metadata = Base.metadata


def get_url() -> str:
    """
    Return the sync DATABASE_URL for Alembic migrations.
    Priority: DATABASE_URL env var → pydantic settings → error.
    """
    url = os.environ.get("DATABASE_URL")
    if not url:
        from app.core.config import settings
        url = settings.DATABASE_URL
    if not url:
        raise RuntimeError("DATABASE_URL is not set. Cannot run migrations.")
    print(f"[Alembic] Target: {url.split('@')[-1]}")
    return url


def get_engine():
    """
    Build a synchronous SQLAlchemy engine.
    Uses connect_args to pass username directly — avoids psycopg2
    stripping the dot-suffix from usernames like 'postgres.projectref'.
    """
    from urllib.parse import urlparse, urlunparse, quote

    raw_url = get_url()
    parsed = urlparse(raw_url)

    # Re-encode the username with percent-encoding so psycopg2 preserves it
    encoded_user = quote(parsed.username or "", safe="")
    encoded_pass = quote(parsed.password or "", safe="")

    # Rebuild the URL with encoded credentials
    netloc = f"{encoded_user}:{encoded_pass}@{parsed.hostname}:{parsed.port}"
    clean_url = urlunparse((
        parsed.scheme,
        netloc,
        parsed.path,
        parsed.params,
        "sslmode=require",
        parsed.fragment,
    ))

    return create_engine(
        clean_url,
        poolclass=pool.NullPool,
        connect_args={
            "user": parsed.username,        # pass raw username with dot preserved
            "password": parsed.password,
            "sslmode": "require",
        },
    )


def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = get_engine()
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
