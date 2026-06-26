# 🗺️ Puls8 Routing & Architecture Guide

This document elaborates on the entire routing ecosystem of the Puls8 application. It details every available endpoint, the exact business logic implemented inside it, and the constraints (what you can and cannot do).

---

## 🌍 Public Routes (Authentication)
*These routes are available to guests and handle onboarding.*

### `GET /`
- **What it does:** Renders the static Landing Page (`landing.ejs`), introducing the application.

### `GET /register`
- **What it does:** Renders the registration form. It checks the URL query for `?error=` and renders a Bootstrap alert if a previous registration attempt failed.

### `POST /register`
- **What it does:** Receives `email` and `password` and inserts a new row into the `Users` table.
- **Implementation:** 
  - Triggers a Sequelize `beforeCreate` hook to safely hash the password using `bcryptjs`.
  - Triggers an `afterCreate` hook to automatically spawn an empty associated `Profile`.
- **Constraints:** 
  - You **cannot** register as an Instructor. The system hardcodes the role to `student` to prevent privilege escalation.
  - **PRG Pattern:** If you submit invalid data (e.g., empty email), the server will **not** crash. It catches the Sequelize validation error and safely redirects you back to `GET /register?error=...` to avoid form resubmission warnings.

### `GET /login`
- **What it does:** Renders the login form.

### `POST /login`
- **What it does:** Authenticates the user and initiates a session.
- **Implementation:** Looks up the email, and uses `bcrypt.compareSync()` to verify the password. If successful, it securely stores `req.session.userId` and `req.session.role`, acting as the passport for the rest of the application.

### `GET /logout`
- **What it does:** Calls `req.session.destroy()` to obliterate the session cookie and kicks the user back to `/login`.

---

## 🛡️ Global Security Middleware
*Located in `routes/index.js`.*

Before hitting any `/instructor` or `/student` route, the request passes through a global middleware wall.
- **Constraint:** If `req.session.userId` is missing, you are immediately kicked to `/login?error=Please+login+first`. You **cannot** access dashboards by manually typing the URL.

---

## 👨‍🏫 Instructor Routes (`/instructor`)
*The command center for managing cohorts, grades, and progression.*

### `GET /instructor`
- **What it does:** Renders the master Instructor Dashboard.
- **Implementation:** 
  - Executes a massive Eager Loading query joining `Classes` ➔ `Users` ➔ `Profiles` & `Tasks`.
  - Implements the **Search Engine:** If `?search=` is in the query, it uses Sequelize `[Op.iLike]` to dynamically filter the student list.
  - Implements **Empty State UI:** If the search yields no results, it proactively hides empty tables and renders an info alert.

### `POST /instructor/resolve/:id` (Phase Resolution)
- **What it does:** The most destructive and important route. Handles moving a student to the next phase or holding them back.
- **Implementation:** 
  - If **"Move Up"**: Increments `phaseLevel`, wipes `classId` (sending them to the Waiting Pool).
  - If **"Repeat"**: Flags `isRepeater = true`, wipes `classId`, and triggers a cascading **Promise Chain** that completely obliterates their previous `Scores` (`Score.destroy()`), resetting their progress for the repeated phase.

### `POST /instructor/assign/:id`
- **What it does:** Assigns a stranded student from the Waiting Pool into an active Class.

### `GET /instructor/grade/:id`
- **What it does:** Renders the grading form for a specific student.
- **Constraint (Phase-Locking):** You **cannot** grade a student on tasks outside their phase. The backend strictly filters the `Tasks` dropdown using `where: { phase: student.phaseLevel }`.

### `POST /instructor/grade/:id`
- **What it does:** Submits a grade for a task.
- **Implementation:** Uses Sequelize's advanced `findOrCreate` upsert logic to ensure duplicate score rows are never created.

### `GET /instructor/evaluate/:id` & `POST /instructor/evaluate/:id`
- **What it does:** Allows the instructor to set subjective data (`learningStyle`, `gritLevel`) on the student's `Profile`. This data is later compiled by an Instance Method into the AI Dossier.

### `GET /instructor/classes/add` & `POST /instructor/classes/add`
- **What it does:** Creates a new cohort.
- **Constraint:** `phaseLevel` cannot exceed 3.

### `GET /instructor/tasks/add` & `POST /instructor/tasks/add`
- **What it does:** Injects new tasks into the curriculum.

---

## 🎒 Student Routes (`/student`)
*The portal for individual progression and peer support.*

### `GET /student`
- **What it does:** Renders the student's personal scores and tasks.

### `GET /student/rescue`
- **What it does:** Renders the form to deploy a P2P "Rescue Flare".
- **Constraint (Paradox Filter):** You **cannot** deploy a flare for a task you've already passed. The backend explicitly filters out passed tasks before rendering the dropdown.

### `POST /student/rescue` (The MVP Feature)
- **What it does:** Summons a classmate to help you using the Discord API.
- **Implementation:**
  1. Queries the DB to find a "Smart Peer" (someone in your exact class who scored > 80 on this task).
  2. Actively excludes *you* from the query so you don't ping yourself.
  3. If a peer is found, it instantiates a `discord.js` Webhook and fires an SOS ping to the server using the peer's `@handle`.

### `GET /student/profile` & `POST /student/profile`
- **What it does:** Allows the student to manage their data.
- **Constraint:** Students **cannot** update their own `learningStyle` or `gritLevel` (those fields are disabled in HTML and ignored in the backend POST). They can only self-report their `discordHandle` so the Rescue Flare system can tag them.
