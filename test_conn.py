import psycopg2
import sys
from urllib.parse import quote_plus

# Test connection using DSN string format which preserves the full username
host = "aws-1-ap-northeast-2.pooler.supabase.com"
port = 5432
user = "postgres.meiybbpcneynddjwzrcy"
password = "wdIgH0oEW97onJME"
dbname = "postgres"

# Method 1: DSN string
dsn = f"host={host} port={port} user={user} password={password} dbname={dbname} sslmode=require connect_timeout=10"
print(f"Testing DSN string connection...")
try:
    conn = psycopg2.connect(dsn)
    print(f"SUCCESS via DSN! Server version: {conn.server_version}")
    
    # Create all tables now
    cur = conn.cursor()
    cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename")
    tables = [row[0] for row in cur.fetchall()]
    print(f"Existing tables: {tables}")
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f"DSN FAILED: {e}")

# Method 2: URL with percent-encoded @ in username replaced by semicolon
encoded_user = quote_plus(user)
url = f"postgresql://{encoded_user}:{password}@{host}:{port}/{dbname}?sslmode=require"
print(f"\nTesting URL with encoded user...")
try:
    conn = psycopg2.connect(url)
    print(f"SUCCESS via URL! Server version: {conn.server_version}")
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f"URL FAILED: {e}")

print("\nAll methods failed.")
sys.exit(1)
