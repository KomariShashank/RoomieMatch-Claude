"""
FastAPI application for RoomieMatch backend.
Provides health check endpoint and connects to Supabase database.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import initialize_database
from app.config import FRONTEND_ORIGIN


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI startup and shutdown events.
    Initializes the database on startup.
    """
    # Startup: Initialize database
    print("Starting up FastAPI application...")
    initialize_database()
    print("FastAPI application ready!")
    
    yield
    
    # Shutdown: Clean up resources (if needed in future)
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
    allow_origins=[FRONTEND_ORIGIN],  # Frontend origin from .env
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


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
