# vflex-issuetracker

Issue tracker with a React/Vite frontend and Express/MongoDB API.

## Run locally

1. Copy `backend/.env.example.txt` to `backend/.env` and set `MONGO_URI` and a secure `JWT_SECRET`.
2. Copy `frontend/.env.example` to `frontend/.env` if the API is not running at `http://localhost:5000`.
3. Run `npm run dev` inside both `backend` and `frontend`.

The frontend uses `VITE_API_URL` (including `/api/v1`) and authenticates protected issue requests with the token returned by the API.

Login and registration are rate-limited to five requests per IP address every 15 minutes.
