# Profile & Matching Endpoints Testing Commands

## Prerequisites

1. **Start the FastAPI server:**
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Get an access token by logging in:**
   ```powershell
   $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","password":"password123"}'
   $TOKEN = $response.access_token
   Write-Host "Token: $TOKEN"
   ```

---

## Test Commands (Windows PowerShell)

### 1. POST /profile/habits - Save Habit Preferences

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/profile/habits" `
-Method POST `
-Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $TOKEN"} `
-Body '{"cleanliness_level":8,"sleep_schedule":"Night owl","smoking":false,"drinking":true,"social_level":7}'
```

**Expected Response:**
```json
{
  "message": "Profile updated successfully"
}
```

**Verify:**
- Check Supabase Table Editor → profiles table
- Your user's row should now have the habit fields populated

---

### 2. GET /profile/me - Get Your Profile

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/profile/me" `
-Method GET `
-Headers @{"Authorization"="Bearer $TOKEN"}
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "created_at": "2024-01-01T00:00:00",
  "email": "test@example.com",
  "full_name": "Test User",
  "age": 25,
  "cleanliness_level": 8,
  "sleep_schedule": "Night owl",
  "smoking": false,
  "drinking": true,
  "social_level": 7
}
```

---

### 3. GET /matches - Get Top 3 Roommate Matches

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/matches" `
-Method GET `
-Headers @{"Authorization"="Bearer $TOKEN"}
```

**Expected Response:**
```json
[
  {
    "full_name": "Match 1",
    "age": 24,
    "score": 95,
    "cleanliness_level": 8,
    "sleep_schedule": "Night owl",
    "smoking": false,
    "drinking": true,
    "social_level": 7
  },
  {
    "full_name": "Match 2",
    "age": 26,
    "score": 78,
    "cleanliness_level": 6,
    "sleep_schedule": "Night owl",
    "smoking": false,
    "drinking": false,
    "social_level": 5
  },
  {
    "full_name": "Match 3",
    "age": 23,
    "score": 65,
    "cleanliness_level": 5,
    "sleep_schedule": "Early bird",
    "smoking": false,
    "drinking": true,
    "social_level": 8
  }
]
```

**Note:** You need at least 1 other user with completed habits to see matches.

---

## Create Test Users for Matching

To test the matching algorithm, create multiple users with different habits:

### User 1 (Very Compatible)
```powershell
# Signup
$user1 = Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/signup" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"user1@example.com","password":"password123","full_name":"Alice Smith","age":24}'
$token1 = $user1.access_token

# Set habits (very similar to test user)
Invoke-RestMethod -Uri "http://127.0.0.1:8000/profile/habits" -Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token1"} -Body '{"cleanliness_level":8,"sleep_schedule":"Night owl","smoking":false,"drinking":true,"social_level":7}'
```

### User 2 (Moderately Compatible)
```powershell
# Signup
$user2 = Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/signup" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"user2@example.com","password":"password123","full_name":"Bob Johnson","age":26}'
$token2 = $user2.access_token

# Set habits (somewhat different)
Invoke-RestMethod -Uri "http://127.0.0.1:8000/profile/habits" -Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token2"} -Body '{"cleanliness_level":6,"sleep_schedule":"Night owl","smoking":false,"drinking":false,"social_level":5}'
```

### User 3 (Less Compatible)
```powershell
# Signup
$user3 = Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/signup" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"user3@example.com","password":"password123","full_name":"Carol Davis","age":23}'
$token3 = $user3.access_token

# Set habits (quite different)
Invoke-RestMethod -Uri "http://127.0.0.1:8000/profile/habits" -Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token3"} -Body '{"cleanliness_level":3,"sleep_schedule":"Early bird","smoking":true,"drinking":false,"social_level":9}'
```

---

## Mac/Linux/Git Bash Commands

### Get Token
```bash
TOKEN=$(curl -X POST "http://127.0.0.1:8000/auth/login" \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"password123"}' | jq -r '.access_token')
```

### Save Habits
```bash
curl -X POST "http://127.0.0.1:8000/profile/habits" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{"cleanliness_level":8,"sleep_schedule":"Night owl","smoking":false,"drinking":true,"social_level":7}'
```

### Get Profile
```bash
curl -X GET "http://127.0.0.1:8000/profile/me" \
-H "Authorization: Bearer $TOKEN"
```

### Get Matches
```bash
curl -X GET "http://127.0.0.1:8000/matches" \
-H "Authorization: Bearer $TOKEN"
```

---

## Compatibility Scoring Breakdown

The matching algorithm calculates a score out of 100:

- **Cleanliness Level** (30 points max): `30 - (abs(difference) × 30 / 9)`
- **Sleep Schedule** (20 points): Exact match = 20, otherwise 0
- **Smoking** (15 points): Exact match = 15, otherwise 0
- **Drinking** (15 points): Exact match = 15, otherwise 0
- **Social Level** (20 points max): `20 - (abs(difference) × 20 / 9)`

**Example:**
- Your habits: cleanliness=8, sleep="Night owl", smoking=false, drinking=true, social=7
- Match habits: cleanliness=8, sleep="Night owl", smoking=false, drinking=true, social=7
- **Score: 100** (perfect match!)

---

## Troubleshooting

### Error: "Missing or invalid authorization header"
- Make sure you're including the Authorization header
- Format must be: `Authorization: Bearer <token>`

### Error: "Invalid or expired token"
- Token may have expired, login again to get a new one
- Check that the token is being passed correctly

### Error: "Please complete your habit preferences first"
- You need to call POST /profile/habits before GET /matches
- Make sure your cleanliness_level is set (not null)

### Empty matches array
- Create more test users with completed habits
- At least one other user must have cleanliness_level set
