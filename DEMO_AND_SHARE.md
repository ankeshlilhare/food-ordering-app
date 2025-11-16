# Demo, Repo & Sharing Instructions

This file explains how to create a short demo video, share the repository, and provide the deliverables requested.

1) README - already present
- The project root README contains steps to run the backend and frontend locally.

2) API Collection
- `API_COLLECTION.postman_collection.json` is included at the repo root. Import into Postman and set `{{baseUrl}}` to your local backend URL (e.g., `http://localhost:8081`).

3) Demo Video
- Recommended length: 2–5 minutes
- Show the following flows:
  1. Start backend and frontend (show terminal briefly)
  2. Login as `nick.fury` (ADMIN) and show admin pages
  3. Create a restaurant (optional) and delete a restaurant (show confirmation modal)
  4. Browse restaurants and menu items (show images and INR pricing for India)
  5. Place an order (show request and response)
- Recording tools: use Loom, OBS Studio, or native OS screen recorder. Export MP4.
- Upload location: Google Drive, Dropbox, or similar (paste public link below).

4) Sharing the repository
- If you want to publish the repo on GitHub from this workspace (example commands):

```powershell
cd "d:\Work space"
git init
git add .
git commit -m "Initial commit - Food Ordering App"
# create a repo on GitHub and then:
git remote add origin https://github.com/<your-user>/<your-repo>.git
git branch -M main
git push -u origin main
```

5) What I included here
- `README.md` — run & troubleshooting instructions (already present)
- `API_COLLECTION.postman_collection.json` — Postman collection
- `DATASETS.md` — details about `data.sql` and seeding/reset
- `ARCHITECTURE_AND_DESIGN.md` — architecture overview
- `DEMO_AND_SHARE.md` — this file: demo recording + sharing instructions

6) Add your share links here
- GitHub repo URL: __________________________
- Demo video URL (Drive/YouTube): __________________________

If you want, I can:
- Record a short demo for you (I can generate a script and steps).
- Export a ready-to-share ZIP with the collection and docs.
- Add an OpenAPI/Swagger spec to `food-ordering-app`.
