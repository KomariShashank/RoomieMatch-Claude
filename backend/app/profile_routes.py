"""
Profile and matching endpoints for RoomieMatch.
Handles user profile updates, profile retrieval, and roommate matching.
"""

import httpx
import psycopg2
from fastapi import APIRouter, HTTPException, Header
from typing import List
from app.config import SUPABASE_URL, SUPABASE_ANON_KEY, DATABASE_URL, DATABASE_PWD
from app.models import HabitsRequest, ProfileResponse, MatchResponse


# Create API Router for profile-related endpoints
router = APIRouter()


def get_supabase_base_url():
    """
    Extract the base Supabase URL from the REST API URL.
    Converts https://xxx.supabase.co/rest/v1/ to https://xxx.supabase.co
    """
    base_url = SUPABASE_URL.replace("/rest/v1/", "").rstrip("/")
    return base_url


async def get_current_user(authorization: str):
    """
    Get the current user ID from the authorization token.
    
    Args:
        authorization: Authorization header value (Bearer <token>)
    
    Returns:
        str: User ID from Supabase
    
    Raises:
        HTTPException: If token is invalid or user cannot be retrieved
    """
    # In production verify JWT properly
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    # Extract token from "Bearer <token>"
    token = authorization.replace("Bearer ", "").strip()
    
    # Call Supabase to get user info from token
    base_url = get_supabase_base_url()
    user_url = f"{base_url}/auth/v1/user"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": SUPABASE_ANON_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(user_url, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        data = response.json()
        user_id = data.get("id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Could not extract user ID from token")
        
        return user_id


def get_database_connection():
    """
    Create and return a connection to the Supabase PostgreSQL database.
    """
    connection_string = DATABASE_URL.replace("[YOUR-PASSWORD]", DATABASE_PWD)
    try:
        conn = psycopg2.connect(connection_string)
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")


@router.post("/profile/habits")
async def update_habits(
    request: HabitsRequest,
    authorization: str = Header(None)
):
    """
    Update user's habit preferences in their profile.
    Requires authentication via Bearer token.
    
    # In production verify JWT properly
    """
    # Get current user ID from token
    user_id = await get_current_user(authorization)
    
    # Update profile in database
    conn = None
    cursor = None
    
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        update_query = """
        UPDATE profiles
        SET cleanliness_level = %s,
            sleep_schedule = %s,
            smoking = %s,
            drinking = %s,
            social_level = %s
        WHERE id = %s
        """
        
        cursor.execute(update_query, (
            request.cleanliness_level,
            request.sleep_schedule,
            request.smoking,
            request.drinking,
            request.social_level,
            user_id
        ))
        
        conn.commit()
        
        print(f"✓ Habits updated for user: {user_id}")
        
        return {"message": "Profile updated successfully"}
        
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {e}")
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@router.get("/profile/me", response_model=ProfileResponse)
async def get_my_profile(authorization: str = Header(None)):
    """
    Get the current user's profile information.
    Requires authentication via Bearer token.
    
    # In production verify JWT properly
    """
    # Get current user ID from token
    user_id = await get_current_user(authorization)
    
    # Fetch profile from database
    conn = None
    cursor = None
    
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        select_query = """
        SELECT id, created_at, email, full_name, age,
               cleanliness_level, sleep_schedule, smoking, drinking, social_level
        FROM profiles
        WHERE id = %s
        """
        
        cursor.execute(select_query, (user_id,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Convert row to dictionary
        profile = {
            "id": str(row[0]),
            "created_at": str(row[1]),
            "email": row[2],
            "full_name": row[3],
            "age": row[4],
            "cleanliness_level": row[5],
            "sleep_schedule": row[6],
            "smoking": row[7],
            "drinking": row[8],
            "social_level": row[9]
        }
        
        return ProfileResponse(**profile)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {e}")
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@router.get("/matches", response_model=List[MatchResponse])
async def get_matches(authorization: str = Header(None)):
    """
    Get top 3 roommate matches based on compatibility score.
    Calculates compatibility using habit preferences.
    
    # In production verify JWT properly
    """
    # Get current user ID from token
    user_id = await get_current_user(authorization)
    
    # Fetch current user's profile and all other profiles
    conn = None
    cursor = None
    
    try:
        conn = get_database_connection()
        cursor = conn.cursor()
        
        # Get current user's profile
        my_profile_query = """
        SELECT cleanliness_level, sleep_schedule, smoking, drinking, social_level
        FROM profiles
        WHERE id = %s
        """
        
        cursor.execute(my_profile_query, (user_id,))
        my_row = cursor.fetchone()
        
        if not my_row or my_row[0] is None:
            raise HTTPException(
                status_code=400, 
                detail="Please complete your habit preferences first"
            )
        
        my_cleanliness = my_row[0]
        my_sleep = my_row[1]
        my_smoking = my_row[2]
        my_drinking = my_row[3]
        my_social = my_row[4]
        
        # Get all other profiles with habits completed
        others_query = """
        SELECT id, full_name, age, cleanliness_level, sleep_schedule, 
               smoking, drinking, social_level
        FROM profiles
        WHERE id != %s AND cleanliness_level IS NOT NULL
        """
        
        cursor.execute(others_query, (user_id,))
        other_profiles = cursor.fetchall()
        
        # Calculate compatibility scores
        matches = []
        
        for profile in other_profiles:
            other_id, full_name, age, cleanliness, sleep, smoking, drinking, social = profile
            
            # Cleanliness score (30 points max)
            cleanliness_diff = abs(my_cleanliness - cleanliness)
            cleanliness_score = 30 - (cleanliness_diff * 30 / 9)
            
            # Sleep schedule score (20 points)
            sleep_score = 20 if my_sleep == sleep else 0
            
            # Smoking score (15 points)
            smoking_score = 15 if my_smoking == smoking else 0
            
            # Drinking score (15 points)
            drinking_score = 15 if my_drinking == drinking else 0
            
            # Social level score (20 points max)
            social_diff = abs(my_social - social)
            social_score = 20 - (social_diff * 20 / 9)
            
            # Total score
            total_score = round(
                cleanliness_score + sleep_score + smoking_score + 
                drinking_score + social_score
            )
            
            matches.append({
                "full_name": full_name,
                "age": age,
                "score": total_score,
                "cleanliness_level": cleanliness,
                "sleep_schedule": sleep,
                "smoking": smoking,
                "drinking": drinking,
                "social_level": social
            })
        
        # Sort by score descending and get top 3
        matches.sort(key=lambda x: x["score"], reverse=True)
        top_matches = matches[:3]
        
        return [MatchResponse(**match) for match in top_matches]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate matches: {e}")
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
