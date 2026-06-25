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
const dummyClassData = [
  {
    id: 1,
    name: "PHASE-1-INSTRUCTOR-DUMMY",
    phaseLevel: 1,
    Users: [
      {
        id: 101,
        email: "student@mail.com",
        Scores: [
          { score: 85, Task: { weight: 50, name: "OOP Paradigm" } },
          { score: 90, Task: { weight: 50, name: "PostgreSQL" } }
        ]
      }
    ]
  }
];

// [REQ: Aplikasi - 7. Membuat dan menggunakan helper]
function calculateKKM(classData) {
  // Implement the logic to traverse the nested arrays
  // (classData -> Users -> Scores -> Task.weight) and return the trajectory.
  // ---------------------------------

  return null;
}

module.exports = calculateKKM;
