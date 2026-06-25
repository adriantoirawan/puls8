'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Class, { foreignKey: 'classId' });
      User.hasOne(models.Profile, { foreignKey: 'userId' });
      User.belongsToMany(models.Task, { through: models.Score, foreignKey: 'userId' });
    }

    // [REQ: Aplikasi - 3. Instance method atau getter di model]
    // Instance method requirement (generateDossier)
    generateDossier() {
      return `Student ${this.email} is in Phase ${this.phaseLevel}. AI formatting logic goes here.`;
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // [REQ: Aplikasi - 4. Validasi Sequelize]
      validate: {
        notNull: { msg: "Email is required" },
        notEmpty: { msg: "Email cannot be empty" },
        isEmail: { msg: "Must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        notEmpty: { msg: "Password cannot be empty" },
        len: { args: [8, 100], msg: "Password minimum 8 characters" }
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'student'
    },
    classId: DataTypes.INTEGER,
    phaseLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isRepeater: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      // [REQ: Aplikasi - 6. Hooks]
      beforeCreate: (user, options) => {
        /*
         * TODO: HASH THE PASSWORD
         * 1. Generate a salt using `bcrypt.genSaltSync()`.
         * 2. Hash the `user.password` using `bcrypt.hashSync()`.
         * 3. Reassign the hashed string back to `user.password`.
         * 
         * PITFALL: If you don't reassign the hashed string back to `user.password`,
         * Sequelize will save the plain-text password to the database!
         */
      },
      afterCreate: async (user, options) => {
        if (user.role === 'student') {
          // Promise chaining or await
          await sequelize.models.Profile.create({ userId: user.id }, { transaction: options.transaction });
        }
      }
    }
  });
  return User;
};