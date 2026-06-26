# Puls8 ⚡
**The Ultimate Hacktiv8 Classroom Management Platform**

**Phase 1 Pair Project - Team 5**
- Adrianto Puji Irawan
- Sudrajat Hermanto

---

## 🎯 The Grader's Fast-Track Guide (For Kak Nunin)

Hi Kak Nunin! 👋 We know grading can be exhausting, so we've prepared a highly structured documentation suite to make your review process as easy and transparent as possible. 

Please follow these links in order:

1. 🗺️ **[REQUIREMENT_TREASURE_MAP.md](./REQUIREMENT_TREASURE_MAP.md)** 
   *Start here.* This document maps every single rubric requirement (`REQ-`) and advanced stretch goal (`STR-`) directly to the exact file and line number in our codebase.
2. 🚀 **[TOUR_DE_PULS8.md](./TOUR_DE_PULS8.md)**
   An interactive, step-by-step tour guide that walks you through our app's edge cases, UI fallbacks, and business logic constraints so you don't have to guess how to break it.
3. 🛣️ **[ROUTES.md](./ROUTES.md)**
   The definitive architectural routing guide. It elaborates on exactly what happens inside every GET and POST endpoint.
4. 🧪 **[QA-SUITE.md](./QA-SUITE.md)**
   Our professional, autonomous QA execution plan proving the robustness of our Post/Redirect/Get flow and authentication.

---

## 🧠 What is Puls8?

Puls8 was engineered to solve the real, grueling problems of running a coding bootcamp: scattered grades, tedious cohort assignments, and students suffering alone at 3 AM.

We didn't just build an MVP; we built a robust architecture. 

### ✨ Features & Stretch Goals
- **The "Rescue Flare" (MVP Package):** An integrated Discord Webhook system (`discord.js`) that automatically pings specific "Smart Peers" in your cohort when you are struggling on a task.
- **Strict Phase-Locking:** Complex server-side scoping prevents Instructors from accidentally evaluating students on tasks outside their designated Phase Level.
- **PRG Pattern (Post/Redirect/Get):** Zero "Confirm Form Resubmission" browser warnings. Invalid forms redirect safely while passing errors via query strings.
- **Procedural Seeding Engine:** A massive, dynamically generated database populated with 1,700+ relationally-mapped task scores, securely `bcrypt` hashed users, and 9 different cohorts.
- **Dynamic Empty States:** Proactive UI/UX that politely informs you when your `[Op.iLike]` search yields no results.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Sequelize ORM
- **Frontend:** HTML5, CSS3, Bootstrap 5, EJS Templating
- **Security:** `bcryptjs` (Password Hashing), `express-session`
- **Integrations:** `discord.js` (Webhook API)

---

### Setup & Installation
```bash
# 1. Install dependencies
npm install

# 2. Setup the database
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# 3. Start the server
node app.js
# Or use nodemon: npm run dev
```

*Built with ❤️ by Team Perwakilan Tarung DRAJAT for Hacktiv8.*
