# vflex-issuetracker

Issue tracker with a React/Vite frontend and Express/MongoDB API.

## Tech stack

React 19 and React Router power the single-page frontend, including local session state and protected page routing; Vite provides the development server and production build.

The API uses Express, MongoDB with Mongoose, and JWT authentication, with supporting packages for password hashing (`bcrypt`), CORS, security headers (`helmet`), and rate limiting.

## Run locally

1. Copy `backend/.env.example.txt` to `backend/.env` and set `MONGO_URI` and a secure `JWT_SECRET`.
2. Copy `frontend/.env.example` to `frontend/.env` if the API is not running at `http://localhost:5000`.
3. Run `npm run dev` inside both `backend` and `frontend`.

The frontend uses `VITE_API_URL` (including `/api/v1`) and authenticates protected issue requests with the token returned by the API.

Login and registration are rate-limited to five requests per IP address every 30 minutes.
