import psycopg2
import sys

host = "aws-1-ap-northeast-2.pooler.supabase.com"
user = "postgres.meiybbpcneynddjwzrcy"
password = "OOAQLyQJ3EfkxTCI"
port = 5432

try:
    print(f"Testing new password: {password}")
    conn = psycopg2.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        dbname="postgres",
        sslmode="require",
        connect_timeout=5
    )
    print("SUCCESS! Connected with new password.")
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
