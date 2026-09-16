import os

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL") or "https://placeholder.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"

try:
    supabase: Client = create_client(
        SUPABASE_URL,
        SUPABASE_KEY
    )
except Exception as e:
    print(f"[Supabase Init Warning] {e}")
    supabase = None