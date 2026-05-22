# Full Stack Internship Verification System

A complete MERN Stack application with proper MVC architecture for generating and verifying internship credentials.

## Features
- **HR Panel**: Generate unique 10-character alphanumeric verification codes.
- **Verification Page**: Validate internship details using the generated code.
- **Admin Dashboard**: View system statistics and recent issuances.
- **Modern UI**: Black & white professional theme with glassmorphism UI.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017 or a valid connection string)

### Backend Setup (Server)
1. Navigate to the `server` directory:
   ```bash
   cd project/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. The `.env` file is pre-configured for local development. If using MongoDB Atlas, update `MONGO_URI` in `.env`.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000*

### Frontend Setup (Client)
1. Navigate to the `client` directory:
   ```bash
   cd project/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The app runs on http://localhost:5173*

## Folder Structure
```
project/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Verification, HRPanel, Dashboard
│   │   ├── services/       # Axios API logic
│   │   ├── App.jsx         # React Router setup
│   │   └── main.jsx        # Entry point
│   ├── tailwind.config.js
│   └── package.json
└── server/                 # Express Backend
    ├── config/             # DB Connection
    ├── controllers/        # Request handlers
    ├── middleware/         # Error & Validation
    ├── models/             # Mongoose Schemas
    ├── routes/             # API routes
    ├── utils/              # Helper functions
    ├── .env                # Environment Variables
    ├── server.js           # Express App Entry
    └── package.json
```
