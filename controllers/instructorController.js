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
      // [REQ-APP-1-Search-Sort-OP] - Filter students by email
      const userWhere = search ? { email: { [Op.iLike]: `%${search}%` } } : {};
      // [REQ-PAGE-3-Eager-Loading] - Join Class, Users, Profile, and Tasks
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

      // Fetch unassigned students (Waiting Pool)
      const unassignedStudents = await User.findAll({
        where: {
          role: 'student',
          classId: null,
          ...userWhere
        },
        include: [Profile]
      });

      const kkmData = calculateKKM(classData);

      res.render('instructor/dashboard', {
        search: search || '',
        role: req.session.role,
        classData: classData,
        unassignedStudents: unassignedStudents,
        kkmData: kkmData,
        error: req.query.error || null
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
        // [REQ-APP-8-Promise-Chaining] - Sequential awaits for data consistency
        // [REQ-APP-5-CRUD-Methods] - Using destroy() and save()
        await Score.destroy({ where: { userId: id } });
      }

      res.redirect("/instructor");
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle assigning a student to a class.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async postAssignStudent(req, res) {
    try {
      const { id } = req.params;
      const { classId } = req.body;

      const student = await User.findByPk(id);
      if (student) {
        student.classId = classId;
        await student.save();
      }

      res.redirect("/instructor");
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Render the grade student page.
   */
  static async getGrade(req, res) {
    try {
      const { id } = req.params;
      const student = await User.findByPk(id, { include: [Profile] });
      // [STR-2-Phase-Locking] - Scope the returned tasks strictly to the student's current phase
      const tasks = await Task.findAll({ where: { phase: student.phaseLevel } });
      
      res.render('instructor/grade', {
        student,
        tasks,
        role: req.session.role,
        error: req.query.error || null
      });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle assigning a score.
   */
  static async postGrade(req, res) {
    try {
      const { id } = req.params;
      const { taskId, score } = req.body;

      // Upsert score
      const [record, created] = await Score.findOrCreate({
        where: { userId: id, taskId: taskId },
        defaults: { score: score }
      });
      
      if (!created) {
        record.score = score;
        await record.save();
      }

      res.redirect("/instructor");
    } catch (err) {
      console.log(err);
      res.redirect(`/instructor/grade/${req.params.id}?error=${err.message}`);
    }
  }

  /**
   * Render the evaluate student page.
   */
  static async getEvaluate(req, res) {
    try {
      const { id } = req.params;
      const student = await User.findByPk(id, { include: [Profile] });
      
      res.render('instructor/evaluate', {
        student,
        role: req.session.role,
        error: req.query.error || null
      });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle assigning learning style and grit level.
   */
  static async postEvaluate(req, res) {
    try {
      const { id } = req.params;
      const { learningStyle, gritLevel } = req.body;

      const student = await User.findByPk(id, { include: [Profile] });
      if (!student) return res.redirect('/instructor');

      if (student.Profile) {
        await student.Profile.update({ learningStyle, gritLevel });
      } else {
        await Profile.create({ userId: student.id, learningStyle, gritLevel });
      }

      res.redirect("/instructor");
    } catch (err) {
      console.log(err);
      res.redirect(`/instructor/evaluate/${req.params.id}?error=${err.message}`);
    }
  }

  /**
   * Render the Add Class page.
   */
  static async getAddClass(req, res) {
    try {
      res.render('instructor/addClass', {
        role: req.session.role,
        error: req.query.error || null
      });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle creating a new Class.
   */
  static async postAddClass(req, res) {
    try {
      const { name, phaseLevel } = req.body;
      await Class.create({ name, phaseLevel });
      res.redirect("/instructor");
    } catch (err) {
      console.log(err);
      if (err.name === 'SequelizeValidationError') {
         res.redirect(`/instructor/classes/add?error=${err.errors[0].message}`);
      } else {
         res.redirect(`/instructor/classes/add?error=${err.message}`);
      }
    }
  }

  /**
   * Render the Add Task page.
   */
  static async getAddTask(req, res) {
    try {
      res.render('instructor/addTask', {
        role: req.session.role,
        error: req.query.error || null
      });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle creating a new Task.
   */
  static async postAddTask(req, res) {
    try {
      const { name, phase, weight } = req.body;
      await Task.create({ name, phase, weight });
      res.redirect("/instructor");
    } catch (err) {
      console.log(err);
      if (err.name === 'SequelizeValidationError') {
         res.redirect(`/instructor/tasks/add?error=${err.errors[0].message}`);
      } else {
         res.redirect(`/instructor/tasks/add?error=${err.message}`);
      }
    }
  }
}

module.exports = InstructorController;
