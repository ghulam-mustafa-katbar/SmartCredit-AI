import urllib.request
from urllib.error import HTTPError

try:
    urllib.request.urlopen('https://meiybbpcneynddjwzrcy.supabase.co')
except HTTPError as e:
    print(e.headers)
