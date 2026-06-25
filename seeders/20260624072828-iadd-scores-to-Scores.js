'use strict';
const fsProm = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dataStr = await fsProm.readFile('./data/scores.json', 'utf-8');
    const data = JSON.parse(dataStr);
    await queryInterface.bulkInsert('Scores', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Scores', null, {});
  }
};
