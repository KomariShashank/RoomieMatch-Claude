"""
FastAPI application for RoomieMatch backend.
Provides health check endpoint and connects to Supabase database.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import initialize_database
from app.models import SignupRequest, LoginRequest, AuthResponse
from app.supabase_auth import signup_user, login_user
from app.profile_routes import router as profile_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI startup and shutdown events.
    """
    print("Starting up FastAPI application...")
    yield
    print("Shutting down FastAPI application...")


# Create FastAPI application with lifespan
app = FastAPI(
    title="RoomieMatch API",
    description="Backend API for RoomieMatch roommate matching application",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include profile and matching routes
app.include_router(profile_router)


@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    Returns a simple status message.
    
    # In production tokens must be verified
    """
    return {"status": "ok"}


@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Welcome to RoomieMatch API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.post("/auth/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """
    Create a new user account.
    Creates user in Supabase Auth and profile in database.
    
    # In production verify tokens with Supabase JWT
    """
    try:
        result = await signup_user(
            email=request.email,
            password=request.password,
            full_name=request.full_name,
            age=request.age
        )
        return AuthResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Authenticate an existing user.
    Returns access token for authenticated requests.
    
    # In production verify tokens with Supabase JWT
    """
    try:
        result = await login_user(
            email=request.email,
            password=request.password
        )
        return AuthResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
