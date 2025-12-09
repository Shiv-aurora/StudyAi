# AI Study Planner (Honors Project)

A smart, full-stack study planning application designed to help students manage coursework, estimate study time, and optimize their weekly schedules using a difficulty-weighted algorithm.

## 🚀 Live Demo
**[Insert Deployment Link Here]** _(Follow Deployment Guide below)_

## 🛠 Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Recharts
- **Backend:** Node.js, Express (v4 Stable)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (HttpOnly Cookies)
- **Deployment:** Netlify (Frontend) + Render (Backend)

## ✨ Key Features
- **🤖 AI Workload Planner:** Auto-generates a weekly schedule based on task difficulty (1-5), deadlines, and available study hours.
- **👤 One-Click Guest Access:** Instantly generates a demo account pre-seeded with 5 courses and 7+ sample tasks for testing.
- **📊 Analytics Dashboard:** Visualizes study habits with completion rates, difficulty distribution, and hours per course.
- **🗓 Interactive Calendar:** Drag-and-drop style view of upcoming deadlines.
- **🔒 Secure Auth:** robust JWT authentication with protection against XSS and CSRF.

## 📦 Installation & Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shiv-aurora/StudyAi.git
   cd StudyAi
   ```

2. **Install Dependencies**
   ```bash
   # Install Server dependencies
   cd server && npm install
   
   # Install Client dependencies
   cd ../client && npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

4. **Run the App**
   ```bash
   # Terminal 1: Start Backend
   cd server && npm start

   # Terminal 2: Start Frontend
   cd client && npm run dev
   ```

## ☁️ Deployment Guide (Stable)

For maximum stability, we split the deployment:
- **Backend** → **Render** (Prevents database connection drops)
- **Frontend** → **Netlify** (Fastest static serving)

**Step 1: Backend (Render)**
1. Create a **Web Service** on Render connected to this repo.
2. Set Root Directory: `server` | Command: `node index.js`.
3. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).

**Step 2: Frontend (Netlify)**
1. Import this repo to Netlify.
2. Set Base Directory: `client` | Build Command: `npm run build`.
3. Add Environment Variable: `VITE_API_URL` = `https://your-render-backend-url.onrender.com`.

## 🔮 Future Improvements
- machine learning model for personalized time estimation.
- Google Calendar 2-way sync.
- Mobile application (React Native).
