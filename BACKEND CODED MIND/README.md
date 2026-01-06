# Backend Coded Mind

A Node.js backend implementing user registration, approval, and login flow with Firebase Auth and MongoDB.

## Flow

1. **REGISTER**: User signs up via Firebase Auth (creates user)
2. **Backend**: Sets user status to PENDING
3. **Admin Approves**: Admin changes status to ACTIVE and assigns subscription
4. **LOGIN**: Firebase verifies token, backend checks status
5. **Access or Block**: Based on status

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   - Firebase config (already set)
   - MONGO_URI (set to your MongoDB URI)
   - For Firebase Admin: Download service account key from Firebase Console and set `GOOGLE_APPLICATION_CREDENTIALS` or update `middleware/auth.js`

3. Start MongoDB locally or update MONGO_URI for cloud DB.

4. Run the server:
   ```bash
   npm start
   ```

## API Endpoints

### POST /auth/register
- Requires Firebase ID token in Authorization header
- Creates user with PENDING status

### POST /auth/login
- Requires Firebase ID token
- Checks user status and allows/block access

### POST /auth/approve/:uid
- Admin endpoint to approve user
- Body: { "subscription": "basic" }

### GET /auth/profile
- Get user profile (requires auth)

## Firebase Setup

- Client-side: Use Firebase Auth SDK to sign up/sign in users
- Send ID token to backend endpoints
- Backend verifies token and manages user status

## MongoDB Schema

User:
- uid: Firebase UID
- email: User email
- status: PENDING | ACTIVE | BLOCKED
- subscription: e.g., "basic", "premium"
- createdAt, approvedAt