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
      const { taskId } = req.body;
      const currentStudent = await User.findByPk(req.session.userId, {
        include: Profile
      });

      if (!currentStudent) {
        return res.redirect('/login?error=Session+expired.+Please+login+again.');
      }

      const { Op } = require('sequelize');
      const smartPeer = await User.findOne({
        where: { classId: currentStudent.classId },
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
                content: `🚨 **RESCUE FLARE DEPLOYED** 🚨\n${strugglingStudent} is completely stuck on **"${taskName}"** and needs your help, @${smartPeer.Profile.discordHandle}! You scored an 80+ on this, so you are their best hope!`,
            });
        } catch(discordErr) {
            console.log(discordErr);
        }
      }

      res.redirect('/student');
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = StudentController;
