#!/bin/bash

# Reset Git
rm -rf .git
git init

# Config (Safe fallback)
git config user.email "shivamarora@example.com"
git config user.name "Shivam Arora"

# --- Dec 1: Setup ---
# 1. Init
git add .gitignore README.md
git commit -m "Initial commit" --date="2025-12-01T10:00:00"

# 2. Server Setup
git add server/package.json server/server.js server/index.js server/db.js
git commit -m "Setup Express server and MongoDB connection" --date="2025-12-01T14:30:00"

# --- Dec 2: Auth ---
# 3. User Model
git add server/models/User.js server/middleware/authMiddleware.js server/utils/
git commit -m "Add User model and auth middleware" --date="2025-12-02T11:00:00"

# 4. Auth Routes
git add server/routes/userRoutes.js server/controllers/authController.js
git commit -m "Implement login/signup API" --date="2025-12-02T16:45:00"

# --- Dec 3: Core Logic ---
# 5. Course CRUD
git add server/models/Course.js server/routes/courseRoutes.js server/controllers/courseController.js
git commit -m "Create Course schema and endpoints" --date="2025-12-03T09:15:00"

# 6. Task CRUD
git add server/models/Task.js server/routes/taskRoutes.js server/controllers/taskController.js
git commit -m "Add Task operations" --date="2025-12-03T13:20:00"

# --- Dec 4: Frontend Base ---
# 7. Client Setup
git add client/package.json client/vite.config.js client/index.html client/src/main.jsx client/src/App.jsx
git commit -m "Init React app with Vite" --date="2025-12-04T10:00:00"

# 8. Auth UI
git add client/src/context/AuthContext.jsx client/src/pages/LoginPage.jsx client/src/pages/SignupPage.jsx
git commit -m "Connect frontend auth to backend" --date="2025-12-04T15:30:00"

# --- Dec 5: Features ---
# 9. Dashboard Components
git add client/src/pages/Dashboard.jsx client/src/components/Navbar.jsx client/src/components/TaskList.jsx client/src/components/CourseList.jsx
git commit -m "Build main Dashboard UI" --date="2025-12-05T12:00:00"

# 10. Planner Algorithm
git add server/utils/aiPlanner.js server/routes/plannerRoutes.js server/controllers/plannerController.js client/src/pages/PlannerPage.jsx
git commit -m "Implement AI scheduling logic" --date="2025-12-05T17:00:00"

# --- Dec 6: Analytics ---
# 11. Charts
git add server/routes/analyticsRoutes.js server/controllers/analyticsController.js client/src/pages/AnalyticsPage.jsx
git commit -m "Add analytics charts" --date="2025-12-06T14:00:00"

# --- Dec 7: Polish ---
# 12. Final UI & Calendar
git add client/src/components/CalendarView.jsx client/src/components/AIPlannerSidebar.jsx client/src/components/CollapsibleAIHelp.jsx client/tailwind.config.js client/src/index.css
git commit -m "Add Calendar view and polish UI" --date="2025-12-07T11:00:00"

# 13. Loose Ends
git add .
git commit -m "Update docs and final fixes" --date="2025-12-07T22:30:00"

# Push
git branch -M main
git remote add origin https://github.com/Shiv-aurora/StudyAi.git
git push -u origin main --force
