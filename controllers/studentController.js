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
      const studentData = await User.findByPk(req.session.userId, {
        include: [
          {
            model: Task,
            through: {model: Score, attributes: ['score']}
          },
        ],
      });

      res.render('student/dashboard', { studentData });
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
      const task = await Task.findAll()
      res.render('student/rescue', {
        task,
        role: req.session.role,
      });
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
      res.redirect('/student')
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
