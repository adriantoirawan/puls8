'use strict';
const fsProm = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dataStr = await fsProm.readFile('./data/classes.json', 'utf-8');
    const data = JSON.parse(dataStr);
    const cleanData = data.map(el => {
      delete el.id
      return el
    })
    await queryInterface.bulkInsert('Classes', cleanData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Classes', null, {});
  }
};
