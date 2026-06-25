/**
 * TODO: CALCULATE KKM TRAJECTORY
 * 
 * The PRD specifies that this helper function processes raw nested arrays
 * into weighted percentages to calculate the current KKM trajectory of a class.
 * 
 * 1. Calculate the weighted scores for each student based on the tasks.
 * 2. Return the class average or processed data structure.
 * 
 * 
 * EXPECTED DATA STRUCTURE (`classData`):
 * [
 *   {
 *     id: 1, name: "Phase 1",
 *     Users: [
 *       {
 *         id: 101, email: "student@mail.com",
 *         Scores: [
 *           { score: 85, Task: { weight: 50, name: "OOP" } },
 *           { score: 90, Task: { weight: 50, name: "PostgreSQL" } }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 * 
 * @param {Array} classData - The eager-loaded class data array from Sequelize.
 * @returns {any} - The calculated class trajectory data.
 */

// [REQ: Aplikasi - 7. Membuat dan menggunakan helper]
function calculateKKM(classData) {
  let studentTrajectories = {};

  // Loop through every class
  classData.forEach(cls => {
    // Loop through every student in the class
    if (cls.Users) {
      cls.Users.forEach(user => {
        let totalWeightedScore = 0;
        
        // Loop through their nested Scores array (from dummy data or future eager load)
        if (user.Scores) {
          user.Scores.forEach(scoreObj => {
            let score = scoreObj.score;
            let weight = scoreObj.Task.weight;
            
            // Calculate the weighted score
            totalWeightedScore += (score * (weight / 100));
          });
        }
        
        // Store the result mapped to the user's ID
        studentTrajectories[user.id] = totalWeightedScore;
      });
    }
  });

  return studentTrajectories;
}

module.exports = calculateKKM;
