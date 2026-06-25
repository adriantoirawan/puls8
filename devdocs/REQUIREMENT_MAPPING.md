# Puls8 - Hacktiv8 Requirement Treasure Map

This document maps every single pair project requirements from the Hacktiv8 Phase 1 Pair Project requirements to the exact file and line marker in the Puls8 codebase.

**NOTE:** Throughout the codebase, you can search for `// [REQ:` marker to instantly find where the business logic for a specific rubric item is implemented.

---

## 💾 Requirement Level Database

### 1. Schema Table (ERD)
- **Fulfillment:** The design was drawn using dbdiagram.io file format.
- **Location:** `devdocs/puls8_schema.dbml`

### 2. Entitas Users Wajib (email, password, role)
- **Fulfillment:** The `Users` table strictly enforces these three attributes.
- **Location:** `models/user.js` and `migrations/[timestamp]-create-user.js`.

### 3. Memiliki 3 Jenis Asosiasi Berbeda
- **Fulfillment:** 
  - **1 to 1:** `User.hasOne(Profile)` / `Profile.belongsTo(User)`
  - **1 to Many:** `Class.hasMany(User)` / `User.belongsTo(Class)`
  - **Many to Many:** `User.belongsToMany(Task)` through the `Score` junction table.
- **Location:** `models/user.js` (Lines 7-11).

### 4. Membuat Model & Migration
- **Fulfillment:** Standard Sequelize initialization is present across all 5 entities (`User`, `Profile`, `Class`, `Task`, `Score`).

### 5. Membuat Migration Tambahan
- **Fulfillment:** We generate a secondary migration to add a specific Discord column to the Profiles table after its creation.
- **Location:** `migrations/20260624072712-add-discordHandle-to-Profiles.js`

### 6. Membuat Seeder
- **Fulfillment:** The initial database state is generated via seeders, inserting default Classes, Tasks, and an Admin Instructor.
- **Location:** `seeders/`

---

## 🛣️ Requirement Routes

### 1. Minimal 2 GET & 1 POST
- **Fulfillment:** Highly exceeded. Includes GETs for Dashboards and POSTs for Authentication, Phase Resolution, and Rescue Flare deployment.
- **Location:** `routes/index.js`, `routes/instructorRouter.js`, `routes/studentRouter.js`.

### 2. Route untuk Logout
- **Fulfillment:** A dedicated route exists to destroy the session.
- **Location:** `routes/authRouter.js` (`GET /logout`).

---

## ⚙️ Requirement Aplikasi

### 1. Fitur Search / Sort (dengan OP)
- **Fulfillment:** The Instructor Dashboard allows filtering the eager-loaded student table using `Op.iLike` on the email.
- **Marker:** `// [REQ: Aplikasi - 1. Fitur search atau sort menggunakan OP]`
- **Location:** `controllers/instructorController.js`

### 2. Static Method di Model
- **Fulfillment:** The `Class` model contains a static method `getActiveClasses()` to fetch classes that have a valid Phase level.
- **Marker:** `// [REQ: Aplikasi - 2. Static method di model]`
- **Location:** `models/class.js`

### 3. Instance Method / Getter di Model
- **Fulfillment:** The `User` model has a `generateDossier()` prototype method that dynamically formats a string combining student attributes for the instructor view.
- **Marker:** `// [REQ: Aplikasi - 3. Instance method atau getter di model]`
- **Location:** `models/user.js`

### 4. Validasi Sequelize (>1 Jenis)
- **Fulfillment:** The models strictly enforce data integrity using multiple Sequelize validators such as `notNull`, `notEmpty`, `isEmail`, `len`, and `isIn`. These errors must be caught and rendered on the Register page.
- **Marker:** `// [REQ: Aplikasi - 4. Validasi Sequelize]`
- **Location:** `models/user.js`

### 5. CRUD Methods Sequelize
- **Fulfillment:** The controllers utilize the full suite of `findAll`, `findByPk`, `create`, `save`, and `destroy`.

### 6. Hooks
- **Fulfillment:** The `User` model utilizes both `beforeCreate` (for bcrypt password hashing) and `afterCreate` (for auto-generating a blank Profile).
- **Marker:** `// [REQ: Aplikasi - 6. Hooks]`
- **Location:** `models/user.js`

### 7. Membuat Helper
- **Fulfillment:** A dedicated modular helper processes the nested Eager Loaded JSON arrays to calculate class trajectory weightings.
- **Marker:** `// [REQ: Aplikasi - 7. Membuat dan menggunakan helper]`
- **Location:** `helpers/calculateKKM.js`

### 8. Promise Chaining (Multiple Awaits)
- **Fulfillment:** The Phase Resolution POST route requires the instructor to execute multiple sequential awaits (`User.findByPk()`, `Score.destroy()`, and `user.save()`).
- **Marker:** `// [REQ: Aplikasi - 8. Menggunakan mekanisme promise chaining]`
- **Location:** `controllers/instructorController.js`

---

## 📄 Requirement Pages & Explore

### 1 & 2. Landing, Login, Register Pages
- **Fulfillment:** The UI is fully built out in `views/landing.ejs`, `views/login.ejs`, and `views/register.ejs`.

### 3. Page dengan Eager Loading
- **Fulfillment:** The Instructor Dashboard requires a massive query joining 3 tables (`Class` -> `Users` -> `Profiles`) and passing it to the EJS template.
- **Marker:** `// [REQ: Pages - 3. Menampilkan data gabungan dari 2 table atau lebih (eager loading)]`
- **Location:** `controllers/instructorController.js` and `views/instructor/dashboard.ejs`

### Explore 1: Authentication & Middleware
- **Fulfillment:** Global routing is protected by express middleware checking `req.session`. Passwords are hashed using `bcryptjs`.
- **Marker:** `// [REQ: Explore - 1. Membuat sistem login dengan middleware, session & bcryptjs]`
- **Location:** `controllers/authController.js`

### Explore 2: MVP Package (Fitur Unik)
- **Fulfillment:** The "Rescue Flare" system integrates the `discord.js` API to ping specific "Smart Peers" in a Discord server when a student is stuck on a task.
- **Marker:** `// [REQ: Explore - 2. Membuat fitur MVP]`
- **Location:** `controllers/studentController.js`
