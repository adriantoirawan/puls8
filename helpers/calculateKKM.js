/**
 * @param {Array} classData - The eager-loaded class data array from Sequelize.
 * @returns {any} - The calculated class trajectory data.
 */

// [REQ-APP-7-Helper] - Modular helper function for complex mapping
function calculateKKM(classData) {
  let studentTrajectories = {};

  classData.forEach(cls => {
    if (cls.Users) {
      cls.Users.forEach(user => {
        let totalWeightedScore = 0;
        
        if (user.Tasks) {
          user.Tasks.forEach(task => {
            if (task.phase === user.phaseLevel) {
              let score = task.Score.score;
              let weight = task.weight;
              totalWeightedScore += (score * (weight / 100));
            }
          });
        }
        
        studentTrajectories[user.id] = totalWeightedScore;
      });
    }
  });

  return studentTrajectories;
}

module.exports = calculateKKM;
