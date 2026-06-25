# Puls8 Product Requirements Document (PRD)

Puls8 is a specialized classroom management platform built with Express, Sequelize, and EJS, designed for Hacktiv8 Instructors and Students. This document outlines the core business logic and mechanics required for the application.

## Use Cases & Workflows

### Use Case 1: Instructor Cohort Management & Grading
- **Background & Context:** Instructors need to monitor the progress of dozens of students across multiple phases simultaneously.
- **The Problem:** Grading is currently scattered across manual spreadsheets. Instructors cannot easily see who is falling behind without manually aggregating scores.
- **How We Solve It:** Puls8 provides a centralized dashboard that automatically calculates student trajectories (KKM) and uses an AI Dossier instance method to summarize student profiles instantly.
- **Intended User Flow:** Instructor logs in -> Navigates to `/instructor` -> Uses the search bar to filter students -> Analyzes the automatically generated trajectory scores.

### Use Case 2: End-of-Phase Resolution
- **Background & Context:** At the end of every Phase (e.g., Phase 1 to Phase 2), a hard decision must be made: does the student move up or repeat?
- **The Problem:** Moving a student requires updating multiple databases, resetting old scores, and tracking repeater status. Doing this manually leads to data corruption.
- **How We Solve It:** A 1-click Phase Resolution Protocol that utilizes Promise Chaining to autonomously update the student's phase, flag them as repeaters if necessary, and securely wipe old `Score` data.
- **Intended User Flow:** Instructor views dashboard -> Clicks "Move Up" (advances phase) OR "Repeat" (keeps phase, wipes scores) -> Database updates autonomously.

### Use Case 3: Student Self-Service & Peer Rescue
- **Background & Context:** Students often get stuck on difficult tasks (like Sequelize Migrations) late at night when instructors are asleep.
- **The Problem:** Students waste hours being blocked because they don't know which of their peers has already successfully completed the task.
- **How We Solve It:** The "Rescue Flare" MVP Feature. A student can select the task they are stuck on, and the system queries the DB to find a peer who scored >=80 on it, then autonomously pings them via Discord.
- **Intended User Flow:** Student gets stuck -> Logs in -> Deploys Rescue Flare for a specific task -> System finds a smart peer -> Discord bot pings the peer with a cry for help.

---

## Feature Specifications

### `[FEAT-1]` Authentication & Session Management
- **Description:** A robust authentication layer protecting the platform.
- **Mechanics:**
  - Users can Register (`/register`) and Login (`/login`).
  - Passwords MUST be hashed using `bcryptjs` before insertion into the database, utilizing Sequelize **Hooks** (`beforeCreate`, `afterCreate`).
  - Account creation must handle Sequelize **Validations** (e.g. `isEmail`, `len`).
  - Upon successful login, the user's `userId` and `role` (either 'instructor' or 'student') are saved into the `express-session`.
  - A Global Middleware restricts access to unauthorized users.
  - Users can safely log out via `GET /logout` which destroys the session.

### `[FEAT-2]` Instructor Dashboard
- **Description:** The central hub for Instructors to view class trajectories.
- **Mechanics:**
  - Route: `GET /instructor`
  - Fetches and displays all active classes utilizing the **Static Method** `Class.getActiveClasses()`.
  - Must utilize Eager Loading to join `Class` -> `Users` -> `Profiles`.
  - Must include a Search feature that uses Sequelize's `Op.iLike` operator to filter users by their `email` address.
  - Uses an Instance Method `generateDossier()` to dynamically format the student's profile data for display.

### `[FEAT-3]` Phase Resolution Protocol
- **Description:** Allows instructors to grade and resolve a student's phase at the end of the curriculum.
- **Mechanics:**
  - Route: `POST /instructor/resolve/:id`
  - **Move Up:** Advances the student's `phaseLevel` by 1, removes them from their current class, and resets their `isRepeater` status.
  - **Repeat:** Keeps the `phaseLevel` identical, removes them from their class, flags `isRepeater = true`, and crucially, destroys all their `Scores` so they start fresh in the repeated phase.
  - Resolving a student requires multiple sequential database queries and updates, which must be handled securely utilizing **Promise Chaining**.

### `[FEAT-4]` Student Dashboard
- **Description:** The portal for students to view their assignments and scores.
- **Mechanics:**
  - Route: `GET /student`
  - Fetches the active logged-in student using `req.session.userId`.
  - Uses Eager Loading to join `Tasks` through the `Scores` junction table (M:N relationship).
  - Displays the student's current grades and curriculum weights.

### `[FEAT-5]` KKM Trajectory Calculation
- **Description:** A helper function processing the raw database arrays into actionable math.
- **Mechanics:**
  - The `calculateKKM(classData)` helper function receives the highly nested eager-loaded JSON from the Instructor Dashboard.
  - It traverses the arrays (`classData` -> `Users` -> `Scores` -> `Task.weight`) to generate weighted averages representing the class trajectory.

### `[FEAT-6]` Rescue Flare (MVP)
- **Description:** An automated peer-to-peer SOS system leveraging external APIs.
- **Mechanics:**
  - Route: `GET /student/rescue` (Form) and `POST /student/rescue` (Deploy)
  - A stuck student submits the `taskId` they are struggling with.
  - The backend queries the `Scores` table to find a "Smart Peer" who:
    1. Is in the exact same `classId`.
    2. Has already scored `>= 80` on that specific `taskId`.
  - Using the `discord.js` library, the server sends a message to the classroom's Discord channel, tagging the "Smart Peer" (using their `discordHandle` from the `Profile` table) to assist the stuck student in real-time.
