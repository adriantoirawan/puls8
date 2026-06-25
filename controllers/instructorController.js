const { Class, User, Task, Score, Profile, Sequelize } = require("../models");
const calculateKKM = require('../helpers/calculateKKM');
const { where } = require("sequelize");
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
      const search = req.query.search;
      const userWhere = search ? { email: { [Op.iLike]: `%${search}%` } } : {};
      const classData = await Class.getActiveClasses({
        include: [
          {
            model: User,
            where: userWhere,
            required: false, // LEFT OUTER JOIN
            include: [
              { model: Profile }, // Include Profile!
              { model: Task, through: { model: Score, attributes: ["score"] } },
            ],
          },
        ],
      });

      const kkmData = calculateKKM(classData);

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
      const { id } = req.params;
      const { action } = req.body;

      const student = await User.findByPk(id);

      if (action === "moveUp") {
        student.phaseLevel += 1;
        student.classId = null; // Return to waiting pool
        student.isRepeater = false;
        
        await student.save();

      } else if (action === "repeat") {
        student.classId = null; // Return to waiting pool
        student.isRepeater = true;
        
        await student.save();
        // HACKTIV8 DOESN'T DELETE SCORE IF A STUDENT REPEATS,
        // but for the sake of satisfying promise chaining requirements, here we go
        await Score.destroy({ where: { userId: id } });
      }

      res.redirect("/instructor");
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = InstructorController;
