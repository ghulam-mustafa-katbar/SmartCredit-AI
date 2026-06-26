import psycopg2
regions = ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'sa-east-1', 'ca-central-1']

user = "postgres.uduvlyzesnyukpmqldcg"
password = "u2330cIIoQC8qR7X"

for region in regions:
    host = f"aws-0-{region}.pooler.supabase.com"
    try:
        conn = psycopg2.connect(
            host=host,
            port=6543,
            user=user,
            password=password,
            dbname="postgres",
            connect_timeout=3
        )
        print(f"SUCCESS! The correct pooler URL is: postgresql://{user}:[YOUR-PASSWORD]@{host}:6543/postgres")
        conn.close()
        break
    except Exception as e:
        pass
