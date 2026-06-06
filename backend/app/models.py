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


class HabitsRequest(BaseModel):
    """
    Request model for updating user habit preferences.
    """
    cleanliness_level: int
    sleep_schedule: str
    smoking: bool
    drinking: bool
    social_level: int


class ProfileResponse(BaseModel):
    """
    Response model for user profile data.
    Returns all profile information.
    """
    id: str
    created_at: str
    email: str | None
    full_name: str | None
    age: int | None
    cleanliness_level: int | None
    sleep_schedule: str | None
    smoking: bool | None
    drinking: bool | None
    social_level: int | None


class MatchResponse(BaseModel):
    """
    Response model for roommate matches.
    Returns match information with compatibility score.
    """
    full_name: str
    age: int
    score: int
    cleanliness_level: int
    sleep_schedule: str
    smoking: bool
    drinking: bool
    social_level: int
