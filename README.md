# Cinepass Movie Management System

Full-stack movie catalog and admin management system built with:
- **Backend**: Node.js, Express, MongoDB (Mongoose), Multer
- **Frontend**: React (Vite)

## Features

- Create movies with metadata:
  - title, genre, language, ageRating, duration, release date, description
- Upload movie posters (JPG/PNG/WEBP)
- Read catalog and movie details
- Update movie fields and poster image
- Soft delete using `isActive` (deactivate/activate)
- Filtering and sorting:
  - by genre, language, age rating
  - sort by release date, title, or duration
- Visibility business rule:
  - regular catalog shows only `isActive = true`
  - admin panel can view all and toggle active status

## Run locally

1. Install dependencies:
   - `npm run install:all`
2. Configure backend env:
   - Copy `server/.env.example` to `server/.env`
   - Set your MongoDB `MONGO_URI`
3. Start backend:
   - `npm run dev:server`
4. Start frontend:
   - `npm run dev:client`

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.
