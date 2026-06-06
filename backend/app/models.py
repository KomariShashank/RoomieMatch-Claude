"""
Pydantic models for request and response validation.
These models ensure type safety and automatic validation for API endpoints.
"""

from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    """
    Request model for user signup.
    Validates email format and requires all user information.
    """
    email: EmailStr
    password: str
    full_name: str
    age: int


class LoginRequest(BaseModel):
    """
    Request model for user login.
    Requires email and password for authentication.
    """
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """
    Response model for authentication endpoints.
    Returns access token and user information after successful auth.
    """
    access_token: str
    user_id: str
    full_name: str
