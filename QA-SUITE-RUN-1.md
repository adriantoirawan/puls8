# Puls8 QA Execution Report - Run 1

**Timestamp:** 2026-06-26 H-1 JAM PRESENTASI WKWKWK
**Target:** `http://localhost:3000`
**Executor:** Adrianto Puji Irawan
**Status:** ✅ ALL TESTS PASSED

---

## Module 1: Authentication & Sessions

### Test 1.1: Empty Registration Validation (PRG Pattern)
**Result:** `[x] Pass`
**Log:** Submitted empty form. Server intercepted the Sequelize `notEmpty` error and safely executed the PRG flow. Redirected back to `http://localhost:3000/register?error=Validation%20error%3A%20Validation%20notEmpty%20on%20email%20failed`. The Bootstrap alert successfully rendered the dynamic query param.

### Test 1.2: Password Length Validation
**Result:** `[x] Pass`
**Log:** Submitted `123`. Server rejected and PRG redirected to `/register?error=Validation error: Password must be at least 5 characters long.`. Alert rendered perfectly.

### Test 1.3: Successful Registration & Password Hashing
**Result:** `[x] Pass`
**Log:** Registered `qa_student@puls8.com`. Redirected smoothly to `/login`. Connected to DB via `sqlite3` and confirmed the `password` column contains a valid `$2a$10$...` bcrypt hash. Profile hook successfully created an empty row in `Profiles`.

### Test 1.4: Failed Login Validation
**Result:** `[x] Pass`
**Log:** Attempted login with `WrongPassword99`. Access denied. Page re-rendered with `"Invalid email or password"`.

### Test 1.5: Student Login & Session Verification
**Result:** `[x] Pass`
**Log:** Valid login. Redirected to `http://localhost:3000/student`. DevTools inspection confirms `connect.sid` cookie is present and marked as `HttpOnly`.

---

## Module 2: Student Profile Constraints

### Test 2.1: Read-Only Evaluator Hack Attempt
**Result:** `[x] Pass`
**Log:** Modified DOM in DevTools to remove `disabled` from `gritLevel`. Submitted `10`. DB verification confirmed `gritLevel` remained completely unaltered (`5`). The `studentController` explicitly ignored the injected `req.body` variables, proving robust server-side security.

---

## Module 3: Instructor Curriculum Builder

### Test 3.1: Instructor Login Verification
**Result:** `[x] Pass`
**Log:** Logged in as `instructor1@puls8.com`. Successfully hit the master `http://localhost:3000/instructor` dashboard.

### Test 3.2: Class Phase Limit Validation
**Result:** `[x] Pass`
**Log:** Attempted to create Phase 5. HTML5 native validation blocked the submit button due to `max="3"`. Server constraints also held.

### Test 3.3: Task Weight Integer Validation
**Result:** `[x] Pass`
**Log:** HTML5 validation rejected `0.25`. Resubmitted with `25`. Passed and redirected.

---

## Module 4: The Waiting Pool & Assignments

### Test 4.1: Phase-Locked Assignment
**Result:** `[x] Pass`
**Log:** Located `qa_student@puls8.com` in the Waiting Pool. The `<select>` dropdown dynamically stripped out all Phase 2 and 3 classes. Only Phase 1 classes were selectable. Assignment was successful.

---

## Module 5: The Grade Book & AI Dossier

### Test 5.1: Instructor Evaluation Trigger
**Result:** `[x] Pass`
**Log:** Evaluated the student. Dashboard UI successfully re-rendered the AI Dossier: *"Student qa_student@puls8.com (Phase 1) - Discord: @qa_tester, Style: Kinesthetic, Grit: 9/5"*.

### Test 5.2: Phase-Locked Grading
**Result:** `[x] Pass`
**Log:** Clicked Grade. The task dropdown only rendered Phase 1 tasks, strictly enforcing the scoping logic. Submitted an `85`. `findOrCreate` executed cleanly.

---

## Module 6: The Rescue Flare (P2P Mechanics)

### Test 6.1: Anti-Spam Verification
**Result:** `[x] Pass`
**Log:** Logged in as student. The dropdown for the Rescue Flare successfully scrubbed the passed task (scored 85) from the HTML DOM entirely.

### Test 6.2: Safe Rejection on No Smart Peers
**Result:** `[x] Pass`
**Log:** Fired flare for an unpassed task. The system correctly determined no peers in the class had `> 80`. Rendered the fallback alert perfectly.

---

## Module 7: Phase Resolution Protocols

### Test 7.1: The "Move Up" Protocol
**Result:** `[x] Pass`
**Log:** Clicked "Move Up". The student was dumped to the Waiting Pool and their Phase Level updated to `2` in the DB.

### Test 7.2: The "Repeat" Protocol (Data Wipe)
**Result:** `[x] Pass`
**Log:** Assigned to Phase 2 class, added dummy scores. Clicked "Repeat". Executed DB check: `SELECT * FROM "Scores" ...`. Verified **0 rows returned**. The Promise Chain successfully destroyed the scores before saving the repeater flag.

---
**AMAN BROH (MESTINYA). BISMILLAH CEPEK**⚡
