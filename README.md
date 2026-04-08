# 🚀 CareerSprint — Placement Routine Tracker (Full Stack)

CareerSprint is a productivity-focused routine tracker built for **6-month campus placement preparation**.

It helps you manage daily goals across:

- **DSA**
- **Aptitude**
- **Projects**
- **Core Subjects**

using **recurring routines**, **custom tasks**, a **focus timer**, and a complete **history dashboard** — so you never lose consistency.

---

## 🌐 Live Demo

- Frontend: https://career-sprint-omega.vercel.app/
- Backend: https://careersprint-backend.onrender.com/

## 🎥 Demo Video

- https://YOUR_VIDEO_LINK

---

## ✨ Highlights

- ✅ Today-first workflow (daily command center)
- 🔁 Recurring routine templates (Daily / Weekly / Monthly)
- 📌 One-time tasks for any date
- ⏱️ Focus timer + time spent tracking
- 🧾 Full history with filters (date range + category)
- ⚡ Quick Add task modal on Today
- 🌙 Dark mode + Light mode + System theme + toggle
- 🔐 JWT auth stored securely in **HttpOnly cookies**
- 📱 Fully responsive UI (desktop sidebar + mobile drawer)

---

## 🏆 Key Differentiators

- Secure JWT auth using **HttpOnly cookies** (not localStorage)
- Recurring templates auto-generate daily task instances
- Focus timer ensures **only one running timer globally**
- History dashboard supports filters + source tracking (template/custom)
- Fully separated Template vs Instance architecture (scalable design)

---

## 🧠 Why CareerSprint?

CareerSprint converts placement prep into a structured daily execution system.

Most to-do apps are too generic.

CareerSprint is designed specifically for **placement preparation**, where your routine often looks like:

- Monday: Arrays + Percentages + Project
- Tuesday: Strings + Ratio + Project
- Wednesday: Two pointers + Average + DBMS
- ...

CareerSprint helps you:

- **Plan once** (Templates)
- **Execute daily** (Today)
- **Track consistency** (History)
- **Track focus time** (Timer)

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS (Vite plugin)
- Axios
- React Router DOM
- Lucide Icons

### Backend

- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- HttpOnly Cookie Sessions

---

## 📂 Project Structure

```txt
CareerSprint/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│   └── .env (ignored)
│
└── Frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── routes/
    │   └── utils/
    ├── vite.config.ts
    ├── package.json
    └── .env (ignored)
```

> Backend follows a clean MVC structure with controllers, middleware, and routes separated for scalability.

---

## 🗃️ Database Models (Simplified)

### User

- name
- email
- passwordHash

### TaskTemplate

- userId
- title
- category
- frequency (daily/weekly/monthly)
- isActive
- createdAt

### TaskInstance

- userId
- templateId (optional)
- title
- category
- status (PENDING/DONE)
- date
- timeSpentMinutes
- createdAt
- updatedAt

---

## 🔥 Core Features

### 1) 🔐 Authentication

- Register / Login / Logout
- Session restore via `/me`
- JWT stored securely in **HttpOnly cookies**
- Protected routes (`/app/*`)
- Public routes blocked if already logged in (`/login`, `/register`)
- Passwords hashed using bcrypt

---

### 2) 📅 Today Dashboard (Main Page)

- Shows only tasks for today
- Tasks grouped by categories:
  - DSA
  - Aptitude
  - Project
  - Core
  - Other
- Progress bar + stats (total / done / pending)
- Quick Add task modal
- Edit / Delete task instances
- Sync indicator

---

### 3) 🔁 Recurring Templates

- Create recurring tasks:
  - Daily
  - Weekly
  - Monthly
- Auto-generates tasks for Today
- Pause / Resume templates (`isActive`)
- Edit templates
- Delete templates with advanced options:
  - delete template only
  - delete template + future instances
  - delete template + all instances

---

### 4) ⏱️ Focus Timer (Robust Logic)

- Start / Stop timer per task
- Only **one running timer at a time**
- Starting a new timer auto-stops the previous one
- Timer continues from previous saved time (does not reset to 0)
- Total focus time shown in Today dashboard
- Focus time saved into DB (`timeSpentMinutes`)

---

### 5) 🧾 History Dashboard

- Old tasks go to History (Today stays clean)
- Filters:
  - date range
  - category
  - completion status
- Shows:
  - completion
  - time spent
  - created source (template/custom)

---

### 6) 🌙 UI / UX

- Auto theme detection (system theme)
- Manual toggle button
- No theme flash on first load (FOUC fixed)
- Professional dashboard layout:
  - full-width topbar
  - sidebar below topbar
  - mobile sidebar drawer
- Clean modern SaaS styling

---

# ⚙️ Local Setup

## ⚡ Quick Start

```bash
cd Backend && pnpm install && pnpm run dev
cd ../Frontend && pnpm install && pnpm run dev
```

## ✅ Prerequisites

- Node.js 18+
- pnpm
- MongoDB Atlas URI

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CareerSprint.git
cd CareerSprint
```

## 🖥 Backend Setup (Express + MongoDB)

## 2️⃣ Install Dependencies

```bash
cd Backend
pnpm install
```

> This project uses **pnpm**. Install it using: `npm i -g pnpm`

## 3️⃣ Create .env

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_JWT_SECRET
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 4️⃣ Run Backend

```bash
pnpm run dev
```

Backend will run at: http://localhost:5000

---

## 🌐 Frontend Setup (React + Vite)

## 5️⃣ Install Dependencies

```bash
cd ../Frontend
pnpm install
```

## 6️⃣ Create .env

Create this file:
Frontend/.env

```bash
VITE_API_URL=http://localhost:5000/api
```

> Restart the frontend server after updating `.env`.

## 7️⃣ Run Frontend

```bash
pnpm run dev
```

Frontend will run at: http://localhost:5173

> Base URL: `/api`

# 🔌 API Overview (Main Endpoints)

> All endpoints require authentication unless mentioned otherwise.

## Auth

> Register/Login are public. `/me` requires a valid cookie session.

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Register user              |
| POST   | `/api/auth/login`    | Login user                 |
| POST   | `/api/auth/logout`   | Logout user                |
| GET    | `/api/auth/me`       | Get current logged-in user |

---

## Tasks (Task Instances)

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| GET    | `/api/tasks/today`           | Get today tasks      |
| POST   | `/api/tasks`                 | Create one-time task |
| PATCH  | `/api/tasks/:id`             | Update task          |
| DELETE | `/api/tasks/:id`             | Delete task          |
| PATCH  | `/api/tasks/:id/toggle`      | Toggle complete      |
| PATCH  | `/api/tasks/:id/start-timer` | Start timer          |
| PATCH  | `/api/tasks/:id/stop-timer`  | Stop timer           |

---

## Templates (Recurring)

| Method | Endpoint                           | Description           |
| ------ | ---------------------------------- | --------------------- |
| GET    | `/api/templates`                   | Get templates         |
| POST   | `/api/templates`                   | Create template       |
| PATCH  | `/api/templates/:id`               | Update template       |
| DELETE | `/api/templates/:id`               | Delete template       |
| PATCH  | `/api/templates/:id/toggle-active` | Pause/Resume template |

---

## History

| Method | Endpoint                                           | Description  |
| ------ | -------------------------------------------------- | ------------ |
| GET    | `/api/tasks/history?from=YYYY-MM-DD&to=YYYY-MM-DD` | Task history |

---

# 🔐 Authentication Notes (Cookies)

CareerSprint stores JWT securely in **HttpOnly cookies**.

## Frontend Requirement

Your Axios instance must include:

```js
axios.create({
  withCredentials: true,
});
```

## Backend Requirement

### CORS must allow credentials:

```js
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### Cookie Options (Production)

#### In production, cookies must be set with:

```js
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
```

> ⚠️ Note: In production (Render + Vercel), cookies require HTTPS. `sameSite: "none"` only works with `secure: true`.

---

## 🌍 Deployment (Render + Vercel)

### Backend Deployment (Render)

- Push the code to GitHub
- Create a new Render Web Service
- Set Root Directory = Backend

- Build Command:

```bash
pnpm install
```

- Start Command:

```bash
pnpm start
```

#### Render Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_SECRET_KEY
FRONTEND_URL=https://YOUR_VERCEL_APP.vercel.app
```

### Frontend Deployment (Vercel)

- Import the repo into Vercel
- Set Root Directory = Frontend
- Add environment variable:

```env
VITE_API_URL=https://YOUR_RENDER_BACKEND.onrender.com/api
```

---

# 📸 Screenshots

| Page            | Preview                                 |
| --------------- | --------------------------------------- |
| Landing Page    | ![Landing](screenshots/landing.png)     |
| Today Dashboard | ![Today](screenshots/today.png)         |
| Templates       | ![Templates](screenshots/templates.png) |
| History         | ![History](screenshots/history.png)     |

---

# 🧩 Roadmap / Future Improvements

- [ ] Streak tracking (daily consistency)
- [ ] Weekly analytics dashboard
- [ ] Pause template until a specific date
- [ ] Export history as CSV
- [ ] Notifications / reminders
- [ ] Drag-and-drop ordering for Today tasks

---

## 📌 What I Learned

- Designing recurring templates → generating daily task instances
- Managing secure authentication using HttpOnly cookies
- Handling complex timer edge cases (one active timer at a time)
- Building scalable backend structure (controllers, middleware, utils)
- Creating a clean SaaS-like UI with responsive layout

# 👨‍💻 Author

**Subham**  
B.Tech CSE (AIML) — MAKAUT  
Built for placement preparation + real consistency.

---

# ⭐ Support

If you found this useful, consider giving this repo a ⭐ on GitHub.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

## 📄 License

MIT
