# RoomieMatch Testing Guide

This guide provides comprehensive instructions for testing the RoomieMatch application, including both backend and frontend components.

## Prerequisites

Before testing, ensure you have:
- Python 3.8+ installed
- Node.js 14+ and npm installed
- Supabase account with project credentials
- Backend and frontend environment variables configured

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with your Supabase credentials:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

### 3. Initialize Database

Run the database initialization script to create tables:

```bash
cd backend
python -c "from app.database import init_db; init_db()"
```

Expected output:
```
Database initialized successfully!
Tables created: users, profiles
```

### 4. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 5. Test Backend Health Endpoint

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"healthy","message":"RoomieMatch API is running"}
```

## Backend API Testing

### Test 1: User Signup

```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"full_name\":\"Test User\",\"age\":25}"
```

Expected response (200 OK):
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user_id": "uuid-here",
  "full_name": "Test User"
}
```

**Save the `access_token` for subsequent tests.**

### Test 2: User Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Expected response (200 OK):
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user_id": "uuid-here",
  "full_name": "Test User"
}
```

### Test 3: Create User Profile

Replace `YOUR_TOKEN` with the access token from signup/login:

```bash
curl -X POST http://localhost:8000/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"user_id\":\"YOUR_USER_ID\",\"cleanliness\":8,\"sleep_schedule\":\"moderate\",\"smoking\":\"no\",\"drinking\":\"socially\",\"social_level\":7}"
```

Expected response (200 OK):
```json
{
  "message": "Profile created successfully",
  "profile_id": "uuid-here"
}
```

### Test 4: Get User Profile

```bash
curl -X GET http://localhost:8000/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response (200 OK):
```json
{
  "id": "uuid-here",
  "user_id": "uuid-here",
  "cleanliness": 8,
  "sleep_schedule": "moderate",
  "smoking": "no",
  "drinking": "socially",
  "social_level": 7,
  "created_at": "2026-06-07T03:00:00"
}
```

### Test 5: Get Matches

First, create additional test users with profiles, then:

```bash
curl -X GET http://localhost:8000/profile/matches \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response (200 OK):
```json
{
  "matches": [
    {
      "user_id": "uuid-here",
      "full_name": "Another User",
      "age": 26,
      "cleanliness": 7,
      "sleep_schedule": "moderate",
      "smoking": "no",
      "drinking": "socially",
      "social_level": 6,
      "match_score": 85
    }
  ]
}
```

### Test 6: Error Cases

**Test invalid login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"wrongpassword\"}"
```

Expected response (401 Unauthorized):
```json
{"detail":"Invalid credentials"}
```

**Test unauthorized access:**
```bash
curl -X GET http://localhost:8000/profile
```

Expected response (401 Unauthorized):
```json
{"detail":"Not authenticated"}
```

**Test duplicate signup:**
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"full_name\":\"Test User\",\"age\":25}"
```

Expected response (400 Bad Request):
```json
{"detail":"User already exists"}
```

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Ensure `.env` file exists in the root directory:

```
REACT_APP_API_URL=http://localhost:8000
```

### 3. Start Frontend Development Server

```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view roomiematch in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## Frontend Manual Testing

### Test 1: User Signup Flow

1. Open browser to `http://localhost:3000`
2. Click "Don't have an account? Sign Up"
3. Fill in the signup form:
   - Full Name: "Test User"
   - Age: 25
   - Email: "newuser@example.com"
   - Password: "password123"
4. Click "Sign Up →"
5. **Expected:** Redirected to Lifestyle Preferences screen

### Test 2: User Login Flow

1. Open browser to `http://localhost:3000`
2. Fill in the login form:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Sign In →"
4. **Expected:** Redirected to Lifestyle Preferences screen

### Test 3: Lifestyle Preferences

1. After login/signup, you should be on the Lifestyle Preferences screen
2. Adjust the sliders and radio buttons:
   - Cleanliness: 8/10
   - Sleep Schedule: Moderate
   - Smoking: No
   - Drinking: Socially
   - Social Level: 7/10
3. Click "Find Matches"
4. **Expected:** Profile saved, redirected to Matches screen

### Test 4: View Matches

1. After saving preferences, you should see the Matches screen
2. **Expected:** 
   - Match cards displayed with user information
   - Match score percentage shown
   - Like/Pass buttons available
3. Click "👍 Like" on a match
4. **Expected:** Success message, navigation to Connect screen
5. Go back and click "👎 Pass" on a match
6. **Expected:** Move to next match profile

### Test 5: Session Persistence

1. Login to the application
2. Navigate to Lifestyle Preferences
3. Refresh the browser page
4. **Expected:** Still logged in, session maintained

### Test 6: Logout

1. Navigate to Matches screen
2. Click "Logout" button
3. **Expected:** Redirected to Login screen, session cleared

### Test 7: Error Handling

**Test invalid credentials:**
1. On login screen, enter:
   - Email: "test@example.com"
   - Password: "wrongpassword"
2. Click "Sign In →"
3. **Expected:** Error message displayed: "Invalid credentials"

**Test duplicate signup:**
1. Click "Sign Up"
2. Enter email that already exists
3. **Expected:** Error message displayed: "User already exists"

**Test session expiration:**
1. Login to the application
2. Manually clear localStorage in browser DevTools
3. Try to navigate to Matches
4. **Expected:** Redirected to Login screen

## Integration Testing

### Full User Journey Test

1. **Start both servers:**
   - Backend: `cd backend && uvicorn app.main:app --reload`
   - Frontend: `npm start`

2. **Create new user:**
   - Navigate to `http://localhost:3000`
   - Sign up with new credentials
   - Verify redirect to Lifestyle Preferences

3. **Set preferences:**
   - Fill in all lifestyle preferences
   - Click "Find Matches"
   - Verify redirect to Matches screen

4. **View matches:**
   - Verify matches are displayed
   - Verify match scores are calculated
   - Test Like/Pass functionality

5. **Logout and login:**
   - Logout from the application
   - Login with same credentials
   - Verify session restored

## Common Issues and Troubleshooting

### Backend Issues

**Issue:** `ModuleNotFoundError: No module named 'fastapi'`
- **Solution:** Run `pip install -r requirements.txt` in backend directory

**Issue:** `supabase.exceptions.SupabaseException: Invalid API key`
- **Solution:** Check your `.env` file has correct Supabase credentials

**Issue:** Database tables not created
- **Solution:** Run `python -c "from app.database import init_db; init_db()"`

### Frontend Issues

**Issue:** `REACT_APP_API_URL is not defined`
- **Solution:** Create `.env` file in root with `REACT_APP_API_URL=http://localhost:8000`

**Issue:** CORS errors in browser console
- **Solution:** Ensure backend has CORS middleware configured (already included in main.py)

**Issue:** "Failed to fetch" errors
- **Solution:** Verify backend server is running on port 8000

### Network Issues

**Issue:** Cannot connect to backend from frontend
- **Solution:** 
  1. Check backend is running: `curl http://localhost:8000/health`
  2. Check firewall settings
  3. Verify API_URL in `.env` is correct

## Performance Testing

### Load Testing with curl

Create multiple users:
```bash
for i in {1..10}; do
  curl -X POST http://localhost:8000/auth/signup \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"user$i@example.com\",\"password\":\"password123\",\"full_name\":\"User $i\",\"age\":$((20 + i))}"
done
```

### Browser Performance

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Record while navigating through the app
4. Check for:
   - Page load times < 2 seconds
   - No memory leaks
   - Smooth animations

## Security Testing

### Test JWT Token Validation

1. Login and get access token
2. Modify the token slightly
3. Try to access protected endpoint
4. **Expected:** 401 Unauthorized error

### Test SQL Injection Prevention

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com' OR '1'='1\",\"password\":\"password\"}"
```

**Expected:** Login fails, no SQL injection occurs

## Automated Testing (Future Enhancement)

For automated testing, consider implementing:

### Backend Tests (pytest)
```python
# tests/test_auth.py
def test_signup():
    response = client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User",
        "age": 25
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
```

### Frontend Tests (Jest/React Testing Library)
```javascript
// src/components/__tests__/Login.test.js
test('renders login form', () => {
  render(<Login />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

## Test Data Cleanup

After testing, clean up test data:

```sql
-- Connect to Supabase SQL Editor
DELETE FROM profiles WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE 'test%' OR email LIKE 'user%'
);

DELETE FROM users WHERE email LIKE 'test%' OR email LIKE 'user%';
```

## Conclusion

This testing guide covers:
- ✅ Backend API endpoints
- ✅ Frontend user flows
- ✅ Integration testing
- ✅ Error handling
- ✅ Security testing
- ✅ Performance considerations

For any issues or questions, refer to the main README.md or backend/README.md files.
