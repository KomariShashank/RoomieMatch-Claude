"""
Profile and matching endpoints for RoomieMatch.
Uses Supabase Python client for Vercel serverless compatibility.
"""

import httpx
from fastapi import APIRouter, HTTPException, Header
from typing import List
from app.config import SUPABASE_URL, SUPABASE_ANON_KEY
from app.models import HabitsRequest, ProfileResponse, MatchResponse
from supabase import create_client


router = APIRouter()


def get_supabase_client():
    """Create and return a Supabase client."""
    base_url = SUPABASE_URL.replace("/rest/v1/", "").rstrip("/")
    return create_client(base_url, SUPABASE_ANON_KEY)


def get_supabase_base_url():
    """Extract the base Supabase URL."""
    return SUPABASE_URL.replace("/rest/v1/", "").rstrip("/")


async def get_current_user(authorization: str):
    """
    Get the current user ID from the authorization token.
    # In production verify JWT properly
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, 
            detail="Missing or invalid authorization header"
        )

    token = authorization.replace("Bearer ", "").strip()
    base_url = get_supabase_base_url()
    user_url = f"{base_url}/auth/v1/user"

    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": SUPABASE_ANON_KEY
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(user_url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=401, 
                detail="Invalid or expired token"
            )

        data = response.json()
        user_id = data.get("id")

        if not user_id:
            raise HTTPException(
                status_code=401, 
                detail="Could not extract user ID from token"
            )

        return user_id


@router.post("/profile/habits")
async def update_habits(
    request: HabitsRequest,
    authorization: str = Header(None)
):
    """
    Update user habit preferences.
    # In production verify JWT properly
    """
    user_id = await get_current_user(authorization)

    try:
        supabase = get_supabase_client()
        supabase.table("profiles").update({
            "cleanliness_level": request.cleanliness_level,
            "sleep_schedule": request.sleep_schedule,
            "smoking": request.smoking,
            "drinking": request.drinking,
            "social_level": request.social_level
        }).eq("id", user_id).execute()

        print(f"✓ Habits updated for user: {user_id}")
        return {"message": "Profile updated successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to update profile: {e}"
        )


@router.get("/profile/me", response_model=ProfileResponse)
async def get_my_profile(authorization: str = Header(None)):
    """
    Get the current user's profile.
    # In production verify JWT properly
    """
    user_id = await get_current_user(authorization)

    try:
        supabase = get_supabase_client()
        response = supabase.table("profiles").select("*").eq(
            "id", user_id
        ).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")

        profile = response.data[0]
        return ProfileResponse(**profile)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to fetch profile: {e}"
        )


@router.get("/matches", response_model=List[MatchResponse])
async def get_matches(authorization: str = Header(None)):
    """
    Get top 3 roommate matches based on compatibility score.
    # In production verify JWT properly
    """
    user_id = await get_current_user(authorization)

    try:
        supabase = get_supabase_client()

        # Get current user profile
        my_response = supabase.table("profiles").select("*").eq(
            "id", user_id
        ).execute()

        if not my_response.data or my_response.data[0].get(
            "cleanliness_level"
        ) is None:
            raise HTTPException(
                status_code=400,
                detail="Please complete your habit preferences first"
            )

        me = my_response.data[0]

        # Get all other profiles with habits completed
        others_response = supabase.table("profiles").select("*").neq(
            "id", user_id
        ).not_.is_("cleanliness_level", "null").execute()

        other_profiles = others_response.data

        # Calculate compatibility scores
        matches = []

        for profile in other_profiles:
            cleanliness_diff = abs(
                me["cleanliness_level"] - profile["cleanliness_level"]
            )
            cleanliness_score = 30 - (cleanliness_diff * 30 / 9)

            sleep_score = 20 if me["sleep_schedule"] == profile[
                "sleep_schedule"
            ] else 0

            smoking_score = 15 if me["smoking"] == profile["smoking"] else 0

            drinking_score = 15 if me["drinking"] == profile["drinking"] else 0

            social_diff = abs(
                me["social_level"] - profile["social_level"]
            )
            social_score = 20 - (social_diff * 20 / 9)

            total_score = round(
                cleanliness_score + sleep_score + smoking_score +
                drinking_score + social_score
            )

            matches.append({
                "full_name": profile["full_name"],
                "age": profile["age"],
                "score": total_score,
                "cleanliness_level": profile["cleanliness_level"],
                "sleep_schedule": profile["sleep_schedule"],
                "smoking": profile["smoking"],
                "drinking": profile["drinking"],
                "social_level": profile["social_level"]
            })

        matches.sort(key=lambda x: x["score"], reverse=True)
        top_matches = matches[:3]

        return [MatchResponse(**match) for match in top_matches]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate matches: {e}"
        )