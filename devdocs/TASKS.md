# Puls8 Kanban Tasks Breakdown

---

### 🎫 TASK: Implement User Registration & Password Hashing
**Feature ID:** `[FEAT-1]`
**Target Files:** `controllers/authController.js`, `models/user.js`
**Context:** The app needs a secure way for users to register. We cannot store plain-text passwords in the DB.
**Acceptance Criteria:**
- [ ] You have implemented `await User.create()` inside `postRegister`.
- [ ] You have caught `SequelizeValidationError`s (satisfying the **Validations** rubric) and passed them to the `register` view so the user sees proper error messages instead of a crashed server.
- [ ] You have utilized a Sequelize Hook (`beforeCreate`) in `models/user.js` to hash the password using `bcryptjs` before it saves.

---

### 🎫 TASK: Implement Login & Session Logic
**Feature ID:** `[FEAT-1]`
**Target Files:** `controllers/authController.js`
**Context:** We need to authenticate users and persist their state using sessions so they don't have to log in on every single page load.
**Acceptance Criteria:**
- [ ] Inside `postLogin`, you extract the email and use `User.findOne()` to locate the record.
- [ ] You correctly use `bcrypt.compareSync()` to validate the hashed password.
- [ ] If valid, you save `req.session.userId` and `req.session.role`.
- [ ] You redirect Instructors to `/instructor` and Students to `/student`.
- [ ] Inside `getLogin`, you parse `req.query.error` and pass it to the EJS view to display global middleware redirect errors.

---

### 🎫 TASK: Dynamic Navbar Routing
**Feature ID:** `[FEAT-1]`
**Target Files:** `views/partials/navbar.ejs`, Any controller rendering views.
**Context:** The "Dashboard" link in the navigation bar currently goes nowhere (`/dashboard`). It needs to adapt based on who is logged in.
**Acceptance Criteria:**
- [ ] You have replaced `href="/dashboard"` with EJS logic (e.g., `<%% if (role === 'instructor') ... %%>`).
- [ ] You have ensured that `req.session.role` is passed down into `res.render()` in your controllers so the EJS file has access to the `role` variable.

---

### 🎫 TASK: Instructor Dashboard Eager Loading & Search
**Feature ID:** `[FEAT-2]`
**Target Files:** `controllers/instructorController.js`
**Context:** The Instructor Dashboard requires a complex query to render the HTML table correctly. It needs to show all Classes, their associated Users, and those Users' Profiles.
**Acceptance Criteria:**
- [ ] You replaced `dummyClassData` with the **Static Method** `Class.getActiveClasses()`.
- [ ] You utilized the `include` property to fetch `Class -> Users -> Profiles`.
- [ ] You implemented `Op.iLike` search logic on the `User` model to filter by email if `req.query.search` exists.
- [ ] You applied the `required: false` flag to the User include to force a LEFT OUTER JOIN (so empty classes still render).

---

### 🎫 TASK: Implement AI Dossier Instance Method
**Feature ID:** `[FEAT-2]`
**Target Files:** `models/user.js`, `views/instructor/dashboard.ejs`
**Context:** The instructor table needs a formatted string summarizing a student.
**Acceptance Criteria:**
- [ ] You completed the logic for `User.prototype.generateDossier()` inside `models/user.js` to return a nicely formatted string combining the student's attributes.
- [ ] You called `<%%= user.generateDossier() %%>` inside the EJS loop in `views/instructor/dashboard.ejs`.

---

### 🎫 TASK: Phase Resolution Protocol (Move Up / Repeat)
**Feature ID:** `[FEAT-3]`
**Target Files:** `controllers/instructorController.js`
**Context:** At the end of the phase, instructors must push a button to either advance a student or force them to repeat the phase.
**Acceptance Criteria:**
- [ ] Inside `postResolveStudent`, you extract the student ID and the action (`moveUp` vs `repeat`).
- [ ] **If Move Up:** Increment `phaseLevel`, set `classId` to `null`, `isRepeater = false`.
- [ ] **If Repeat:** Keep `phaseLevel` the same, set `classId` to `null`, `isRepeater = true`.
- [ ] **Crucial for Repeat:** You MUST query the `Scores` table and `destroy()` all scores for this student so they start fresh!
- [ ] You satisfy the **Promise Chaining** rubric by executing the `User.findByPk()`, `Score.destroy()`, and `user.save()` functions sequentially via `await`.

---

### 🎫 TASK: Student Dashboard Eager Loading
**Feature ID:** `[FEAT-4]`
**Target Files:** `controllers/studentController.js`
**Context:** The student needs to see their own grades. This requires querying an M:N association.
**Acceptance Criteria:**
- [ ] You replaced `dummyStudentData` with `User.findByPk(req.session.userId)`.
- [ ] You used `include` to fetch their `Tasks` specifically via the `Scores` through-table.
- [ ] The student dashboard only shows the logged-in student, not the entire database.

---

### 🎫 TASK: Calculate KKM Helper Logic
**Feature ID:** `[FEAT-5]`
**Target Files:** `helpers/calculateKKM.js`, `controllers/instructorController.js`
**Context:** We need a standalone helper function to process the nested database arrays into a trajectory score.
**Acceptance Criteria:**
- [ ] You wrote the mathematical array iteration logic inside `calculateKKM.js` utilizing `Task.weight` and `Score.score`.
- [ ] You successfully imported `require('../helpers/calculateKKM')` into `instructorController.js`.
- [ ] You executed the helper on the `classData` and passed the result to the instructor view.

---

### 🎫 TASK: Discord.js Peer Rescue System (MVP Feature)
**Feature ID:** `[FEAT-6]`
**Target Files:** `controllers/studentController.js`
**Context:** When a student is stuck on an assignment, the system should find a peer who already passed it and ping them on Discord.
**Acceptance Criteria:**
- [ ] Inside `getRescue`, you successfully query and pass all `Tasks` to the EJS dropdown.
- [ ] Inside `postRescue`, you find the current student's `classId`.
- [ ] You query the `Scores` table for a peer who has the exact same `classId` AND scored `>= 80` (`Op.gte`) on the requested `taskId`.
- [ ] You extract that peer's `discordHandle` from their Profile, and use the `discord.js` API to send a message to the server channel tagging them for help.

---

### 🎫 TASK: Build Auth UI (Forms & Errors)
**Feature ID:** `[FEAT-1]`
**Target Files:** `views/register.ejs`, `views/login.ejs`
**Context:** The user needs a way to submit credentials and see validation errors if they fail.
**Acceptance Criteria:**
- [ ] You built the Register & Login HTML forms.
- [ ] You ensured the `<input>` `name` attributes match exactly what your backend `req.body` expects.
- [ ] You implemented `<%% if (error) %%>` EJS logic in both views to display a Bootstrap alert if an error exists.

---

### 🎫 TASK: Build Instructor Dashboard UI
**Feature ID:** `[FEAT-2]`
**Target Files:** `views/instructor/dashboard.ejs`
**Context:** The instructor needs a table mapping out all classes and their respective students.
**Acceptance Criteria:**
- [ ] You built a search bar form that sends a `GET` request to `/instructor` with `name="search"`.
- [ ] You used `<%% classData.forEach() %%>` to iterate over the classes.
- [ ] Inside each class, you iterated over `Users` to render a table row for each student.
- [ ] You successfully called `<%%= user.generateDossier() %%>` inside the EJS template.

---

### 🎫 TASK: Build Student Portal UI
**Feature ID:** `[FEAT-4]`, `[FEAT-6]`
**Target Files:** `views/student/dashboard.ejs`, `views/student/rescue.ejs`
**Context:** The student needs to view their scores and trigger the Discord Rescue Flare.
**Acceptance Criteria:**
- [ ] In `student/dashboard.ejs`, you built a table iterating over `studentData.Scores` to show Task Name, Weight, and Score.
- [ ] In `student/rescue.ejs`, you built a form pointing to `POST /student/rescue`.
- [ ] You iterated over the `tasks` array to populate a `<select>` dropdown with the available tasks.

---

## Collaboration Strategy

1. Never work directly on `main`.
2. Name your branches after the Feature IDs (e.g., `git checkout -b feat/FEAT-1-auth`).
3. Communicate before picking up a Kanban card to ensure you aren't both editing `studentController.js` at the same time.
