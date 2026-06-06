# RoomieMatch Backend

FastAPI backend for the RoomieMatch roommate matching application, connected to Supabase.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Supabase account with database credentials

### Installation

#### For Windows:

```cmd
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Test database initialization
python -m app.database

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### For Mac/Linux:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Test database initialization
python -m app.database

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

### Test Database Connection
```bash
python -m app.database
```
Expected output: "✅ Database initialization completed successfully"

### Test Health Endpoint
Once the server is running, visit:
- http://localhost:8000/health
- Expected response: `{"status": "ok"}`

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py      # Package initializer
│   ├── config.py        # Environment variable loader
│   ├── database.py      # Database connection & initialization
│   └── main.py          # FastAPI application
├── .env                 # Environment variables (DO NOT COMMIT)
├── .env.example         # Template for environment variables
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_database_url
DATABASE_PWD=your_database_password
FRONTEND_ORIGIN=http://localhost:5173
```

## Database Schema

### Profiles Table
- `id` (UUID) - Primary key, references auth.users
- `created_at` (TIMESTAMPTZ) - Auto-generated timestamp
- `email` (TEXT) - User email
- `full_name` (TEXT) - User's full name
- `age` (INTEGER) - User's age
- `cleanliness_level` (INTEGER) - 1-10 scale
- `sleep_schedule` (TEXT) - Sleep preferences
- `smoking` (BOOLEAN) - Smoking status
- `drinking` (BOOLEAN) - Drinking status
- `social_level` (INTEGER) - 1-10 scale

### Row Level Security (RLS)
- All authenticated users can view all profiles
- Users can only update their own profile

## Next Steps

This is the initial backend setup. Future steps will include:
- Authentication endpoints
- Profile CRUD operations
- Matching algorithm
- Real-time updates
