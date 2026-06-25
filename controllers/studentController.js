const { User, Profile, Task, Score } = require('../models');

/**
 * StudentController
 */
class StudentController {

  /**
   * Render the student dashboard.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getDashboard(req, res) {
    try {
      /* 
       * TODO: FETCH CURRENT STUDENT DATA
       * 1. You need to find the User where id === req.session.userId.
       * 2. Eager load their associated Tasks (through Scores).
       * 
       * KEYWORDS TO GOOGLE: "Sequelize findAll include", "Sequelize M:N association queries"
       * DOCS: https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
       * 
       * PITFALL: Don't fetch all users! Only fetch the logged-in student.
       */
      
      const dummyStudentData = {
        email: "student@puls8.com",
        Scores: [
          { score: 95, Task: { name: "OOP Paradigm" } },
          { score: 80, Task: { name: "PostgreSQL" } }
        ]
      };

      res.render('student/dashboard', { studentData: dummyStudentData });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Render the Rescue Flare deployment page.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getRescue(req, res) {
    try {
      /* 
       * TODO: FETCH ALL TASKS
       * 1. We need a list of tasks to display in the dropdown on the Rescue page.
       * 2. Use `Task.findAll()`.
       * 3. Pass this array to the view.
       */
      
      const dummyTasks = [
        { id: 1, name: "OOP Paradigm" },
        { id: 2, name: "PostgreSQL" },
        { id: 3, name: "Express Servers" }
      ];

      res.render('student/rescue', { tasks: dummyTasks });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle the Discord ping deployment.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async postRescue(req, res) {
    try {
      /* 
       * TODO: HANDLE DISCORD PING FOR PEER RESCUE
       * 1. Extract `taskId` from req.body.
       * 2. Find the current student to get their `classId`.
       * 3. Query the database to find a "Smart Peer":
       *    - Another student in the EXACT SAME `classId`.
       *    - Who has a Score of `>= 80` on this specific `taskId`.
       *    - (Hint: use `include` with `Score` and `[Op.gte]: 80`).
       * 4. If a peer is found, extract their `discordHandle` from their `Profile`.
       * 5. Use the `discord.js` library to send a message to a channel tagging them.
       *    // [REQ: Explore - 2. Membuat fitur MVP]
       * 6. Redirect back to /student.
       * 
       * KEYWORDS TO GOOGLE: "discord.js send message to channel", "Sequelize Op.gte"
       * DOCS: https://discordjs.guide/
       */
       
      res.redirect('/student');
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = StudentController;
