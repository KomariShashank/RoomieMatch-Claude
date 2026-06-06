# RoomieMatch

A full-stack roommate matching platform that focuses on lifestyle compatibility such as cleanliness, sleep habits, and social behaviour.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **User Profiles**: Store and manage user information and lifestyle preferences
- **Lifestyle Preferences**: Gather lifestyle compatibility data
  - Cleanliness level (1-10 scale)
  - Sleep schedule (Early Bird, Moderate, Night Owl)
  - Smoking habits
  - Drinking habits
  - Social level (1-10 scale)
- **Smart Matching**: Algorithm-based roommate matching with compatibility scores
- **Match Display**: View potential roommates with detailed profiles
- **Like/Pass Actions**: Interactive buttons to like or pass on potential roommates
- **Session Management**: Persistent authentication with localStorage

## Technology Stack

### Frontend
- **React 18**: Frontend framework
- **CSS3**: Styling with animations and gradients
- **React Context API**: Global state management for authentication
- **Fetch API**: HTTP client for backend communication

### Backend
- **FastAPI**: Modern Python web framework
- **Supabase**: PostgreSQL database and authentication
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing
- **Python 3.8+**: Backend runtime

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn
- Supabase account (free tier available)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/RoomieMatch-Claude.git
cd RoomieMatch-Claude
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your Supabase credentials
# Copy from .env.example and fill in your values
cp .env.example .env

# Initialize the database
python -c "from app.database import init_db; init_db()"

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

#### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install frontend dependencies
npm install

# Create .env file for frontend
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

### Environment Variables

#### Backend (.env in backend/)
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

#### Frontend (.env in root/)
```
REACT_APP_API_URL=http://localhost:8000
```

## Project Structure

```
RoomieMatch-Claude/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration management
│   │   ├── database.py          # Database connection and initialization
│   │   ├── supabase_auth.py     # Authentication logic
│   │   ├── models.py            # Pydantic models
│   │   └── profile_routes.py    # Profile and matching endpoints
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js             # Login/Signup component
│   │   ├── BasicInfo.js
│   │   ├── LifestylePreferences.js  # Profile creation
│   │   ├── Matches.js           # Match display
│   │   ├── ConnectRoommate.js
│   │   └── ChatScreen.js
│   ├── context/
│   │   └── AuthContext.js       # Authentication context
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env
├── package.json
├── TESTING_GUIDE.md
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login existing user

### Profile Management
- `POST /profile` - Create user profile with lifestyle preferences
- `GET /profile` - Get current user's profile
- `GET /profile/matches` - Get compatible roommate matches

### Health Check
- `GET /health` - Check API status

For detailed API documentation, visit `http://localhost:8000/docs` when the backend is running.

## Testing

Comprehensive testing instructions are available in [TESTING_GUIDE.md](TESTING_GUIDE.md).

Quick test:
```bash
# Test backend health
curl http://localhost:8000/health

# Test signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User","age":25}'
```

## Matching Algorithm

The matching algorithm calculates compatibility based on:
- **Cleanliness**: Absolute difference (max 10 points)
- **Sleep Schedule**: Exact match (20 points) or partial match (10 points)
- **Smoking**: Exact match (20 points)
- **Drinking**: Exact match (15 points) or partial match (7 points)
- **Social Level**: Absolute difference (max 10 points)

Maximum possible score: 75 points (converted to percentage)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API endpoints
- CORS configuration for frontend-backend communication
- SQL injection prevention through parameterized queries

## Future Enhancements

- ✅ Backend integration with user authentication
- ✅ Database for storing user profiles and matches
- ✅ Real matching algorithm based on lifestyle compatibility
- 🔄 Messaging system between matched users
- 🔄 Profile pictures and additional user details
- 🔄 Advanced filtering and search options
- 🔄 Email verification
- 🔄 Password reset functionality
- 🔄 User reviews and ratings
- 🔄 Location-based matching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Review backend documentation in [backend/README.md](backend/README.md)
- Open an issue on GitHub
