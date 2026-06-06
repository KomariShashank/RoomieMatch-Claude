"""
Configuration module for loading environment variables.
Uses python-dotenv to load credentials from .env file.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

# Database credentials
DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_PWD = os.getenv("DATABASE_PWD")

# Frontend origin for CORS
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
