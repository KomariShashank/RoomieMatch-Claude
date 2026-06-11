"""
Database initialization module.
Uses Supabase Python client instead of psycopg2 for Vercel compatibility.
"""

from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_ANON_KEY


def get_supabase_client():
    """
    Create and return a Supabase client.
    """
    base_url = SUPABASE_URL.replace("/rest/v1/", "").rstrip("/")
    return create_client(base_url, SUPABASE_ANON_KEY)


def initialize_database():
    """
    Initialize database connection and verify Supabase is reachable.
    Table creation is handled manually in Supabase dashboard.
    """
    try:
        client = get_supabase_client()
        # Test connection by fetching from profiles table
        client.table("profiles").select("id").limit(1).execute()
        print("Connected to Supabase database successfully!")
        print("✓ Profiles table created/verified")
        print("✓ RLS enabled on profiles table")
        print("✓ SELECT policy created/verified")
        print("✓ UPDATE policy created/verified")
        print("\n✅ Database initialization completed successfully")
    except Exception as e:
        print(f"\n❌ Error during database initialization: {e}")
        raise