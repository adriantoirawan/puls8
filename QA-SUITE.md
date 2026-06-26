# Puls8 QA Test Suite

## Module 1: Authentication & Sessions

### Test 1.1: Empty Registration Validation (PRG Pattern)
**Objective:** Verify that missing fields trigger the Global Error Alert and do not crash the server.
**Procedure:**
1. Open browser to `http://localhost:3000/register`.
2. Leave both `email` and `password` fields completely empty.
3. Click the **Register** button.
4. **Verify URL:** Ensure the URL redirects to `http://localhost:3000/register?error=...` (Post/Redirect/Get pattern).
5. **Verify UI:** Verify a red Bootstrap alert banner is visible containing the text `"Validation error: Validation isEmail on email failed"`.

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 1.2: Password Length Validation
**Objective:** Verify the Sequelize `len` constraint works via the UI.
**Procedure:**
1. Navigate to `http://localhost:3000/register`.
2. Enter email: `test1@puls8.com`.
3. Enter password: `123`.
4. Click **Register**.
5. **Verify UI:** Verify the red banner reads `"Validation error: Password must be at least 5 characters long."`.

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 1.3: Successful Registration & Password Hashing
**Objective:** Verify valid registration persists to DB and hashes the password.
**Procedure:**
1. Navigate to `http://localhost:3000/register`.
2. Enter email: `qa_student@puls8.com`.
3. Enter password: `Puls8Rocks2026`.
4. Click **Register**.
5. **Verify URL:** Ensure URL changes to `http://localhost:3000/login`.
6. **Verify DB (Terminal):** Open a secondary terminal. Run `sqlite3 puls8.sqlite` (or your postgres equivalent) and execute: `SELECT email, password, role FROM "Users" WHERE email='qa_student@puls8.com';`
7. **Expected DB Result:** You must see `role` = `student` and a bcrypt hashed string (e.g. `$2a$10$...`), NOT plaintext `Puls8Rocks2026`.

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 1.4: Failed Login Validation
**Objective:** Verify incorrect credentials are rejected safely.
**Procedure:**
1. Navigate to `http://localhost:3000/login`.
2. Enter email: `qa_student@puls8.com`.
3. Enter password: `WrongPassword99`.
4. Click **Login**.
5. **Verify UI:** Verify a red banner reads `"Invalid email or password"`.

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 1.5: Student Login & Session Verification
**Objective:** Verify valid student login generates a secure session cookie.
**Procedure:**
1. Navigate to `http://localhost:3000/login`.
2. Enter email: `qa_student@puls8.com` and password `Puls8Rocks2026`.
3. Click **Login**.
4. **Verify URL:** Ensure URL changes to `http://localhost:3000/student`.
5. **Verify UI:** Verify the heading reads "Student Dashboard".
6. **Verify Session (DevTools):** Press `F12` (or Right Click -> Inspect). Go to the **Application** tab -> **Storage** -> **Cookies**. Verify `connect.sid` exists.

**Result:** `[ ] Pass | [ ] Fail: ____________`

---

## Module 2: Student Profile Constraints

### Test 2.1: Read-Only Evaluator Hack Attempt
**Objective:** Ensure students cannot self-assess Grit or Learning Style.
**Procedure:**
1. While logged in as `qa_student@puls8.com`, navigate to `http://localhost:3000/student/profile`.
2. Locate the "Learning Style" and "Grit Level" input boxes. Verify they are grayed out.
3. **The Hack:** Open Chrome DevTools (`F12`). Inspect the Grit Level `<input>` element. Delete the `disabled` attribute from the HTML.
4. Type `10` into the Grit Level box.
5. Enter Discord Handle: `999999999999999999`.
6. Click **Save Profile**.
7. **Verify DB (Terminal):** Run `SELECT "gritLevel" FROM "Profiles" JOIN "Users" ON "Profiles"."userId" = "Users"."id" WHERE email='qa_student@puls8.com';`
8. **Expected DB Result:** The `gritLevel` MUST remain `5` (or whatever the default is). The hack must fail because the Controller ignores those fields.

**Result:** `[ ] Pass | [ ] Fail: ____________`

---

## Module 3: Instructor Curriculum Builder

### Test 3.1: Instructor Login Verification
**Objective:** Ensure Instructors get routed to the correct command center.
**Procedure:**
1. Navigate to `http://localhost:3000/login`.
2. Enter the seeded instructor email (e.g. `adrianto.irawan@gmail.com`) and its password.
3. Click **Login**.
4. **Verify URL:** Ensure redirect to `http://localhost:3000/instructor`.

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 3.2: Class Phase Limit Validation
**Objective:** Ensure Instructors cannot create Phase 4+ classes.
**Procedure:**
1. Click **"+ New Class"** (Navigates to `/instructor/classes/add`).
2. Enter Class Name: `QA Testers`.
3. Enter Phase Level: `5`.
4. Click **Create Class**.
5. **Verify UI:** The browser's native HTML5 validation popup should block submission because `max="3"`.

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 3.3: Task Weight Integer Validation
**Objective:** Ensure Task weights are stored as whole percentages, not decimals.
**Procedure:**
1. Navigate to `http://localhost:3000/instructor/tasks/add`.
2. Enter Task Name: `QA Final Exam`.
3. Enter Phase Level: `1`.
4. Enter Weight: `0.25`.
5. Click **Create Task**.
6. **Verify UI:** HTML5 validation should block the decimal input. 
7. Change Weight to `25` and click **Create Task**.
8. **Verify URL:** Successfully redirects to `/instructor`.

**Result:** `[ ] Pass | [ ] Fail: ____________`

---

## Module 4: The Waiting Pool & Assignments

### Test 4.1: Phase-Locked Assignment
**Objective:** Prevent Phase 1 students from entering Phase 3 classes.
**Procedure:**
1. On the Instructor Dashboard, scroll to the **Waiting Pool** table.
2. Locate `qa_student@puls8.com` (who defaults to Phase 1).
3. Open the "Select Class" dropdown next to their name.
4. **Verify UI:** Ensure that ONLY Phase 1 classes (e.g., the "QA Testers" class you made) are visible in the dropdown. Any seeded Phase 2 or 3 classes must NOT be present.
5. Select a Phase 1 class and click **Assign**.
6. **Verify UI:** The student disappears from the Waiting Pool and appears in the upper Roster table.

**Result:** `[ ] Pass | [ ] Fail: ____________`

---

## Module 5: The Grade Book & AI Dossier

### Test 5.1: Instructor Evaluation Trigger
**Objective:** Ensure instructors can evaluate students and trigger the Dossier.
**Procedure:**
1. Locate `qa_student@puls8.com` in the Roster table.
2. Click the blue **Evaluate** button.
3. Set Learning Style to `Kinesthetic` and Grit Level to `9`.
4. Click **Save Evaluation**.
5. **Verify UI:** On the dashboard, verify the `Dossier` column for this student now reads: *"Student is a Kinesthetic learner with a grit level of 9/10."*

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 5.2: Phase-Locked Grading
**Objective:** Ensure instructors cannot grade a student on future-phase tasks.
**Procedure:**
1. Click the yellow **Grade** button next to `qa_student@puls8.com`.
2. Open the "Select Task" dropdown.
3. **Verify UI:** Ensure ONLY Phase 1 tasks (like "QA Final Exam") are listed.
4. Select a task, enter Score: `85`, and click **Submit Score**.

**Result:** `[ ] Pass | [ ] Fail: ____________`

---

## Module 6: The Rescue Flare (P2P Mechanics)

### Test 6.1: Anti-Spam Verification
**Objective:** Ensure students cannot ask for help on a task they already passed.
**Procedure:**
1. Open an Incognito window and log back in as `qa_student@puls8.com`.
2. Click **Deploy Rescue Flare** (`/student/rescue`).
3. Open the "Select Task" dropdown.
4. **Verify UI:** Verify that the task you just scored an 85 on in Test 5.2 is COMPLETELY MISSING from the dropdown. 

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 6.2: Safe Rejection on No Smart Peers
**Objective:** Provide safe UI feedback if no peer can help.
**Procedure:**
1. Select a task from the dropdown (one that no one else in the class has passed).
2. Click **Deploy Rescue Flare!**.
3. **Verify UI:** Ensure you are safely redirected back to `/student` with a red banner stating: *"No peers in your class have mastered this task yet. Hang tight!"*

**Result:** `[ ] Pass | [ ] Fail: ____________`

---

## Module 7: Phase Resolution Protocols

### Test 7.1: The "Move Up" Protocol
**Objective:** Verify phase incrementing.
**Procedure:**
1. Go back to the Instructor Dashboard.
2. Locate `qa_student@puls8.com` and click the green **Move Up** button.
3. **Verify UI:** Look in the Waiting Pool. The student should be back there, but their "Current Phase" column should now say `2`.

**Result:** `[ ] Pass | [ ] Fail: ____________`

### Test 7.2: The "Repeat" Protocol (Data Wipe)
**Objective:** Verify repeaters get their scores safely wiped to start fresh.
**Procedure:**
1. As Instructor, assign the student to a Phase 2 class. Grade them with a `40` on a Phase 2 task.
2. Click the red **Repeat** button.
3. **Verify DB (Terminal):** Execute `SELECT * FROM "Scores" JOIN "Users" ON "Scores"."userId" = "Users"."id" WHERE email='qa_student@puls8.com';`
4. **Expected DB Result:** Zero rows returned. All scores for that student must be completely obliterated.
5. **Verify UI:** The student is back in the Wait Pool. Their phase is still `2`.

**Result:** `[ ] Pass | [ ] Fail: ____________`
