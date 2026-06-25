const { Class, User, Task, Score, Profile, Sequelize } = require("../models");
const calculateKKM = require('../helpers/calculateKKM');
const { Op } = Sequelize;

/**
 * InstructorController
 */
class InstructorController {

  /**
   * Render the instructor dashboard.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getDashboard(req, res) {
    try {
      /* 
       * TODO: IMPLEMENT EAGER LOADING & SEARCH & STATIC METHOD
       * 
       * 1. **STATIC METHOD REQUIREMENT**: Fetch active classes using your predefined static method!
       *    `const activeClasses = await Class.getActiveClasses();`
       * 
       * 2. **SEARCH REQUIREMENT**: Check if `req.query.search` exists. 
       *    If it does, construct a `where` clause using Sequelize Operators (`Op.iLike`) to search student emails.
       *    // [REQ: Aplikasi - 1. Fitur search atau sort menggunakan OP]
       * 
       * 3. **EAGER LOADING REQUIREMENT**: Use `Class.findAll()` and `include` to fetch:
       *    Class -> Users -> Profiles.
       *    // [REQ: Pages - 3. Menampilkan data gabungan dari 2 table atau lebih (eager loading)]
       * 
       * 4. **HELPER REQUIREMENT**: Import `helpers/calculateKKM.js` and use it to process `classData` to calculate the trajectory!
       * 
       * KEYWORDS TO GOOGLE: "Sequelize Op.iLike", "Sequelize Eager Loading nested include"
       * DOCS: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
       * 
       * PITFALL: By default, `include` with a `where` clause creates an INNER JOIN. 
       * This means if a class has no matching students, the class won't show up at all! 
       * Add `required: false` to the User include to force a LEFT OUTER JOIN.
       */
      
      const dummyClassData = [
        {
          id: 1,
          name: "PHASE-1-INSTRUCTOR-DUMMY",
          phaseLevel: 1,
          Users: [
            {
              id: 101,
              email: "student@puls8.com",
              phaseLevel: 1,
              Profile: { discordHandle: "Student#1234", learningStyle: "Visual", gritLevel: 4 },
              Scores: [
                { score: 85, Task: { weight: 50, name: "OOP Paradigm" } },
                { score: 90, Task: { weight: 50, name: "PostgreSQL" } }
              ],
              // Mocking the instance method for the dummy object
              generateDossier: function() { return `Student ${this.email} is in Phase ${this.phaseLevel}. AI formatting logic goes here.`; }
            }
          ]
        }
      ];
      
      const classData = dummyClassData; // Temporarily map classData to dummyClassData
      const kkmData = calculateKKM(classData);
      const search = req.query.search;

      res.render('instructor/dashboard', {
        search: search || '',
        role: req.session.role,
        classData: classData,
        kkmData: kkmData
      });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle student phase resolution (Move Up or Repeat).
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async postResolveStudent(req, res) {
    try {
      /*
       * TODO: PHASE RESOLUTION PROTOCOL
       * 1. Extract the `id` of the student from `req.params`.
       * 2. Extract the action (e.g., `moveUp` or `repeat`) from `req.body`.
       * 3. Find the student using `User.findByPk()`.
       * 4. If `moveUp`:
       *    - Increment `phaseLevel` by 1.
       *    - Set `classId` to `null` (returns them to waiting pool).
       *    - Set `isRepeater` to `false`.
       * 5. If `repeat`:
       *    - Keep `phaseLevel` the same.
       *    - Set `classId` to `null`.
       *    - Set `isRepeater` to `true`.
       *    - Find all `Scores` belonging to this user and `destroy()` them so they start fresh.
       * 6. Save the student and redirect back to `/instructor`.
       * 
       * // [REQ: Aplikasi - 8. Menggunakan mekanisme promise chaining]
       */
       
      res.redirect('/instructor');
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = InstructorController;
