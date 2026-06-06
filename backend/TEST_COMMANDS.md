# Authentication Testing Commands

## Prerequisites
Make sure the FastAPI server is running:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Windows PowerShell Commands

### Test Signup
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/signup" `
-Method POST `
-Headers @{"Content-Type"="application/json"} `
-Body '{"email":"test@example.com","password":"password123","full_name":"Test User","age":25}'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user_id": "uuid-here",
  "full_name": "Test User"
}
```

**Verify:**
- Check Supabase Dashboard → Authentication → Users (should see test@example.com)
- Check Supabase Dashboard → Table Editor → profiles (should see new row)

---

### Test Login
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/login" `
-Method POST `
-Headers @{"Content-Type"="application/json"} `
-Body '{"email":"test@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user_id": "uuid-here",
  "full_name": "Test User"
}
```

---

## Mac/Linux/Git Bash Commands

### Test Signup
```bash
curl -X POST "http://127.0.0.1:8000/auth/signup" \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"password123","full_name":"Test User","age":25}'
```

### Test Login
```bash
curl -X POST "http://127.0.0.1:8000/auth/login" \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"password123"}'
```

---

## Alternative: Test via Swagger UI

1. Start the server
2. Open browser to: http://localhost:8000/docs
3. Click on `/auth/signup` → "Try it out"
4. Enter test data and click "Execute"
5. Repeat for `/auth/login`

---

## Troubleshooting

### Error: "Signup failed"
- Check that Supabase credentials in `.env` are correct
- Verify email confirmation is disabled in Supabase (Settings → Authentication → Email Auth)

### Error: "Profile creation failed"
- Ensure `profiles` table exists in Supabase
- Check database connection string in `.env`

### Error: "Login failed"
- Verify user was created successfully
- Check password is correct (minimum 6 characters for Supabase)
