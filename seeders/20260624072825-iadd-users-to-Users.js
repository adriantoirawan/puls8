'use strict';
const fsProm = require('fs').promises;
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dataStr = await fsProm.readFile('./data/users.json', 'utf-8');
    const data = JSON.parse(dataStr);
    
    const salt = bcrypt.genSaltSync(10);
    const users = data.map(u => {
      u.password = bcrypt.hashSync(u.password, salt);
      return u;
    });

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
