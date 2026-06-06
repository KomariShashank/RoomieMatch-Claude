# RoomieMatch

A roommate matching platform that focuses on lifestyle compatibility such as cleanliness, sleep habits, and social behaviour.

## Features

- **Login Screen**: Simple UI-only login interface
- **Basic Information**: Collect user details (name, age, budget, location)
- **Lifestyle Preferences**: Gather lifestyle compatibility data
  - Cleanliness level (1-10 scale)
  - Sleep schedule (Early Bird, Moderate, Night Owl)
  - Smoking habits
  - Drinking habits
  - Social level (1-10 scale)
- **Match Display**: View 3 dummy roommate matches with compatibility scores
- **Like/Pass Actions**: Interactive buttons to like or pass on potential roommates

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Technology Stack

- **React 18**: Frontend framework
- **CSS3**: Styling with animations and gradients
- **React Hooks**: State management (useState)

## Project Structure

```
RoomieMatch-Claude/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── BasicInfo.js
│   │   ├── LifestylePreferences.js
│   │   └── Matches.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Notes

- This is an MVP with no backend or database
- All data is stored in temporary React state
- Authentication is UI-only (no actual validation)
- Match data is hardcoded for demonstration purposes

## Future Enhancements

- Backend integration with user authentication
- Database for storing user profiles and matches
- Real matching algorithm based on lifestyle compatibility
- Messaging system between matched users
- Profile pictures and additional user details
- Advanced filtering and search options
