# Deploy to GitHub & Vercel

## Pre-deploy checklist (done)

- [x] Junk files removed (`{`, `setFormData({`, etc.)
- [x] API base URL uses `REACT_APP_API_URL` (set in Vercel for frontend)
- [x] `.env` and `frontend/build/` in `.gitignore`
- [x] Backend: `resource_type: 'auto'` for uploads; fields `file` and `resume`
- [x] Frontend build verified

---

## 1. Push to GitHub

```bash
git add .
git status   # ensure no .env or node_modules
git commit -m "Neural Breach overhaul, upload fixes, deploy-ready"
git push origin main
```

---

## 2. Vercel – Backend (API)

1. **New Project** → Import your GitHub repo.
2. **Root Directory:** set to `Backend` (not repo root).
3. **Framework Preset:** Other.
4. **Build Command:** leave empty or `echo "No build"`.
5. **Output Directory:** leave empty.
6. **Environment Variables** (Settings → Environment Variables):

   | Name | Value |
   |------|--------|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Long random string (32+ chars) |
   | `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |

7. Deploy. Note the URL (e.g. `https://portfolio-cgpo.vercel.app`).
8. API base path: `https://<your-backend>.vercel.app/api/v1`.

---

## 3. Vercel – Frontend

1. **New Project** → Same repo (or same org).
2. **Root Directory:** set to `frontend`.
3. **Framework Preset:** Create React App.
4. **Build Command:** `npm run build` (default).
5. **Output Directory:** `build` (default).
6. **Environment Variables:**

   | Name | Value |
   |------|--------|
   | `REACT_APP_API_URL` | `https://<your-backend>.vercel.app/api/v1` |

   (Use the backend URL from step 2.)

7. Deploy.

---

## 4. CORS

Backend already allows:

- `localhost`
- `*.vercel.app`

If you use a custom domain for the frontend, add it in `Backend/server.js` in the `origin` check (or allow your frontend origin explicitly).

---

## 5. Optional: seed admin user

Run locally once (with `Backend/.env` set):

```bash
cd Backend
node seedAdmin.js
```

Then use that admin email/password to log in on the live site.
