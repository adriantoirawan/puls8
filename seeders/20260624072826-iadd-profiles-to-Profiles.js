'use strict';
const fsProm = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dataStr = await fsProm.readFile('./data/profiles.json', 'utf-8');
    const data = JSON.parse(dataStr);
    await queryInterface.bulkInsert('Profiles', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};
