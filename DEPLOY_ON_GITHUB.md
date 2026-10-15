# StudyVerse: GitHub + Deployment

## Upload the project to GitHub
1. Open your existing StudyVerse repository on GitHub.
2. If it contains old, incorrectly arranged files, download a backup first.
3. Extract this ZIP on your computer. Upload the *contents* of `studyverse-project/` (not the ZIP itself) to the repository using **Add file → Upload files**. Keep the folders `frontend/` and `backend/` intact.
4. Commit the files. The repository root should contain `README.md`, `.env.example`, `frontend/`, and `backend/`.

## Deploy the website on Vercel
1. In Vercel, choose **Add New → Project** and import this GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`. Install command: `npm install`.
4. Deploy. `frontend/vercel.json` supports client-side routes.

## Deploy the API on Render (optional for the frontend demo)
1. Create a new **Web Service** on Render and connect the same GitHub repository.
2. Set **Root Directory** to `backend`. Build command: `pip install -r requirements.txt`. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. After deployment, open `https://YOUR-API.onrender.com/api/health`. It should return JSON with `status: ok`.

## Important limits
- The frontend currently contains its own demo learning flow. Deploying the frontend does not automatically connect every screen to the backend API.
- The backend currently uses an in-memory SQLite database by default, so saved data can reset when the service restarts. It is suitable for a demo, not production persistence.
- Do not commit real API keys. `.env.example` contains placeholders only.
- Before relying on deployment, confirm the Vercel build succeeds. If it fails, open the build log and fix the first TypeScript/build error.
