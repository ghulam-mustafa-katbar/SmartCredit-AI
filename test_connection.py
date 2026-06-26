import os
import sys

# Set the working DATABASE_URL using the Supabase Session Pooler (IPv4, works on Render)
os.environ["DATABASE_URL"] = "postgresql://postgres.meiybbpcneynddjwzrcy:wdIgH0oEW97onJME@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"

import psycopg2

print("Testing connection to Supabase via Session Pooler...")
try:
    conn = psycopg2.connect(
        host="aws-1-ap-northeast-2.pooler.supabase.com",
        port=5432,
        user="postgres.meiybbpcneynddjwzrcy",
        password="wdIgH0oEW97onJME",
        dbname="postgres",
        sslmode="require",
        connect_timeout=10
    )
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f"Connection successful! PostgreSQL version: {version[0]}")
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)
