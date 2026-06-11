"""
Supabase authentication helper functions.
Handles user signup and login via Supabase Auth API.
"""

import httpx
from app.config import SUPABASE_URL, SUPABASE_ANON_KEY


def get_supabase_base_url():
    """
    Extract the base Supabase URL from the REST API URL.
    Converts https://xxx.supabase.co/rest/v1/ to https://xxx.supabase.co
    """
    # Remove /rest/v1/ from the end to get base URL
    base_url = SUPABASE_URL.replace("/rest/v1/", "").rstrip("/")
    return base_url


async def signup_user(email: str, password: str, full_name: str, age: int):
    """
    Create a new user account in Supabase and insert profile into database.
    
    Args:
        email: User's email address
        password: User's password
        full_name: User's full name
        age: User's age
    
    Returns:
        dict: Contains access_token, user_id, and full_name
    
    Raises:
        Exception: If signup fails or profile creation fails
    """
    base_url = get_supabase_base_url()
    signup_url = f"{base_url}/auth/v1/signup"
    
    # Prepare request headers
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
    }
    
    # Prepare request body with user metadata
    body = {
        "email": email,
        "password": password,
        "data": {
            "full_name": full_name,
            "age": age
        }
    }
    
    # Call Supabase signup API
    async with httpx.AsyncClient() as client:
        response = await client.post(signup_url, json=body, headers=headers)
        
        # Debug: Print response details
        print(f"\n=== SUPABASE SIGNUP DEBUG ===")
        print(f"Signup URL: {signup_url}")
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        print(f"=============================\n")
        
        if response.status_code not in [200, 201]:
            try:
                error_detail = response.json().get("msg", response.json().get("error_description", "Signup failed"))
            except:
                error_detail = response.text
            raise Exception(f"Supabase signup error (status {response.status_code}): {error_detail}")
        
        data = response.json()
    
    # Extract user information from response
    user_id = data.get("user", {}).get("id")
    access_token = data.get("access_token")
    
    # Debug: Print extracted values
    print(f"Extracted user_id: {user_id}")
    print(f"Extracted access_token: {access_token[:20] if access_token else None}...")
    
    if not user_id or not access_token:
        raise Exception(f"Invalid response from Supabase signup. Response data: {data}")
    
    # Insert profile into database
    # Insert profile into database via Supabase REST API
    try:
        profile_url = f"{base_url}/rest/v1/profiles"
        profile_headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        profile_body = {
            "id": user_id,
            "email": email,
            "full_name": full_name,
            "age": age
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(profile_url, json=profile_body, headers=profile_headers)
            if resp.status_code not in (200, 201, 204):
                print(f"Error creating profile: {resp.status_code} {resp.text}")
                raise Exception(f"Profile creation failed: {resp.text}")
        print(f"✓ Profile created for user: {email}")
    except Exception as e:
        print(f"Error creating profile: {e}")
        raise Exception(f"Profile creation failed: {e}")
    return {
        "access_token": access_token,
        "user_id": user_id,
        "full_name": full_name
    }


async def login_user(email: str, password: str):
    """
    Authenticate an existing user and return access token.
    
    Args:
        email: User's email address
        password: User's password
    
    Returns:
        dict: Contains access_token, user_id, and full_name
    
    Raises:
        Exception: If login fails
    """
    base_url = get_supabase_base_url()
    login_url = f"{base_url}/auth/v1/token?grant_type=password"
    
    # Prepare request headers
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
    }
    
    # Prepare request body
    body = {
        "email": email,
        "password": password
    }
    
    # Call Supabase login API
    async with httpx.AsyncClient() as client:
        response = await client.post(login_url, json=body, headers=headers)
        
        # Debug: Print response details
        print(f"\n=== SUPABASE LOGIN DEBUG ===")
        print(f"Login URL: {login_url}")
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        print(f"============================\n")
        
        if response.status_code not in [200, 201]:
            try:
                error_detail = response.json().get("error_description", response.json().get("msg", "Login failed"))
            except:
                error_detail = response.text
            raise Exception(f"Supabase login error (status {response.status_code}): {error_detail}")
        
        data = response.json()
    
    # Extract user information from response
    user_id = data.get("user", {}).get("id")
    access_token = data.get("access_token")
    full_name = data.get("user", {}).get("user_metadata", {}).get("full_name", "")
    
    # Debug: Print extracted values
    print(f"Extracted user_id: {user_id}")
    print(f"Extracted access_token: {access_token[:20] if access_token else None}...")
    print(f"Extracted full_name: {full_name}")
    
    if not user_id or not access_token:
        raise Exception(f"Invalid response from Supabase login. Response data: {data}")
    
    print(f"✓ User logged in: {email}")
    
    # Return authentication response
    return {
        "access_token": access_token,
        "user_id": user_id,
        "full_name": full_name
    }
