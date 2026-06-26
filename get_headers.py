import urllib.request
from urllib.error import HTTPError

try:
    urllib.request.urlopen('https://uduvlyzesnyukpmqldcg.supabase.co')
except HTTPError as e:
    print(e.headers)
