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

      res.render('student/dashboard', { 
        studentData, 
        error: req.query.error || null 
      });
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
      // Find tasks the student already passed
      const studentWithTasks = await User.findByPk(req.session.userId, {
        include: [{ model: Task, through: { model: Score } }]
      });
      
      const passedTaskIds = studentWithTasks && studentWithTasks.Tasks 
        ? studentWithTasks.Tasks.filter(t => t.Score.score >= 80).map(t => t.id)
        : [];

      const { Op } = require('sequelize');
      const task = await Task.findAll({
        where: passedTaskIds.length > 0 ? { id: { [Op.notIn]: passedTaskIds } } : {}
      });

      res.render('student/rescue', {
        task,
        role: req.session.role,
        error: req.query.error || null
      });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle the Discord ping deployment.
   * // [REQ-EXP-2-FINAL-Feature] - Discord.js webhook integration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async postRescue(req, res) {
    try {
      const { taskId } = req.body;
      const currentStudent = await User.findByPk(req.session.userId, {
        include: Profile
      });

      if (!currentStudent) {
        return res.redirect('/login?error=Session+expired.+Please+login+again.');
      }

      const { Op } = require('sequelize');
      const smartPeer = await User.findOne({
        where: { 
          classId: currentStudent.classId,
          id: { [Op.ne]: currentStudent.id } // Prevent self-rescue!
        },
        include: [
          { model: Profile },
          { 
            model: Task, 
            where: { id: taskId }, 
            through: { where: { score: { [Op.gte]: 80 } } } 
          }
        ]
      });

      if (smartPeer && smartPeer.Profile) {
        const { WebhookClient } = require('discord.js');
        try {
            const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1519818281094221955/0hvX8HHNAFX764sLo_g4R1ZQiYir4yJ8Zhd5CyG3NIOwT-LQgbUVogD2Q1OjY5rgmPBq' });
            
            const taskName = smartPeer.Tasks[0].name;
            const strugglingStudent = currentStudent.Profile ? `@${currentStudent.Profile.discordHandle}` : currentStudent.email;

            await webhookClient.send({
                content: `🚨 **RESCUE FLARE DEPLOYED** 🚨\n${strugglingStudent} is completely stuck on **"${taskName}"** and needs your help, <@${smartPeer.Profile.discordHandle}>! You scored an 80+ on this, so you are their best hope!`,
            });
        } catch(discordErr) {
            console.log(discordErr);
        }
        res.redirect('/student');
      } else {
        res.redirect('/student?error=No+peers+in+your+class+have+mastered+this+task+yet.+Hang+tight!');
      }
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Render the student profile page.
   */
  static async getProfile(req, res) {
    try {
      const student = await User.findByPk(req.session.userId, { include: Profile });
      if (!student) return res.redirect('/login');
      
      res.render('student/profile', { 
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
   * Handle student profile update.
   */
  static async postProfile(req, res) {
    try {
      const { discordHandle } = req.body;
      const student = await User.findByPk(req.session.userId, { include: Profile });
      
      if (!student) return res.redirect('/login');

      if (student.Profile) {
        await student.Profile.update({ discordHandle });
      } else {
        await Profile.create({ userId: student.id, discordHandle, learningStyle: 'Unassessed', gritLevel: 5 });
      }

      res.redirect('/student');
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = StudentController;
