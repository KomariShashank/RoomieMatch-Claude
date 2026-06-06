"""
Database initialization module.
Connects to Supabase PostgreSQL and creates the profiles table with RLS policies.
"""

import psycopg2
from psycopg2 import sql
from app.config import DATABASE_URL, DATABASE_PWD


def get_database_connection():
    """
    Create and return a connection to the Supabase PostgreSQL database.
    Replaces [YOUR-PASSWORD] placeholder with actual password.
    """
    # Replace the password placeholder with actual password
    connection_string = DATABASE_URL.replace("[YOUR-PASSWORD]", DATABASE_PWD)
    
    try:
        conn = psycopg2.connect(connection_string)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        raise


def initialize_database():
    """
    Initialize the database by creating the profiles table and setting up RLS policies.
    This function is idempotent - it can be run multiple times safely.
    """
    conn = None
    cursor = None
    
    try:
        # Connect to database
        conn = get_database_connection()
        cursor = conn.cursor()
        
        print("Connected to Supabase database successfully!")
        
        # Create profiles table if it doesn't exist
        create_table_query = """
        CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            email TEXT,
            full_name TEXT,
            age INTEGER,
            cleanliness_level INTEGER CHECK (cleanliness_level >= 1 AND cleanliness_level <= 10),
            sleep_schedule TEXT,
            smoking BOOLEAN DEFAULT FALSE,
            drinking BOOLEAN DEFAULT FALSE,
            social_level INTEGER CHECK (social_level >= 1 AND social_level <= 10)
        );
        """
        cursor.execute(create_table_query)
        print("✓ Profiles table created/verified")
        
        # Enable Row Level Security (RLS) on profiles table
        enable_rls_query = """
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        """
        cursor.execute(enable_rls_query)
        print("✓ RLS enabled on profiles table")
        
        # Create policy: Allow all authenticated users to SELECT all profiles
        # Using DO block to check if policy exists before creating
        select_policy_query = """
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE tablename = 'profiles' 
                AND policyname = 'Allow authenticated users to view all profiles'
            ) THEN
                CREATE POLICY "Allow authenticated users to view all profiles"
                ON profiles
                FOR SELECT
                TO authenticated
                USING (true);
            END IF;
        END $$;
        """
        cursor.execute(select_policy_query)
        print("✓ SELECT policy created/verified")
        
        # Create policy: Allow users to UPDATE only their own profile
        update_policy_query = """
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE tablename = 'profiles' 
                AND policyname = 'Allow users to update own profile'
            ) THEN
                CREATE POLICY "Allow users to update own profile"
                ON profiles
                FOR UPDATE
                TO authenticated
                USING (auth.uid() = id)
                WITH CHECK (auth.uid() = id);
            END IF;
        END $$;
        """
        cursor.execute(update_policy_query)
        print("✓ UPDATE policy created/verified")
        
        # Commit all changes
        conn.commit()
        
        print("\n✅ Database initialization completed successfully")
        
    except Exception as e:
        print(f"\n❌ Error during database initialization: {e}")
        if conn:
            conn.rollback()
        raise
        
    finally:
        # Clean up connections
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# Allow this script to be run standalone for testing
if __name__ == "__main__":
    print("Starting database initialization...\n")
    initialize_database()
