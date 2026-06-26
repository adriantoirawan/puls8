"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  // [REQ-DB-2-Users-Entity] - Must have email, password, and role attributes
  class User extends Model {
    static associate(models) {
      // [REQ-DB-3-Associations] - Many-to-Many through Score, 1-to-Many with Class, 1-to-1 with Profile
      User.belongsTo(models.Class, { foreignKey: "classId" });
      User.hasOne(models.Profile, { foreignKey: "userId" });
      User.belongsToMany(models.Task, {
        through: models.Score,
        foreignKey: "userId",
      });
    }

    // [REQ-APP-3-Instance-Method] - AI Dossier formatting
    generateDossier() {
      let repeaterStatus = "";
      if (this.isRepeater === true) {
        repeaterStatus = "(Repeating)";
      }

      let profileInfo = "No profile details yet.";
      if (this.Profile) {
        profileInfo = `Discord: ${this.Profile.discordHandle}, Style: ${this.Profile.learningStyle}, Grit: ${this.Profile.gritLevel}/5`;
      }

      return `Student ${this.email} (Phase ${this.phaseLevel}) ${repeaterStatus} - ${profileInfo}`;
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // [REQ-APP-4-Sequelize-Validation] - Validates presence and format
        validate: {
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email cannot be empty" },
          isEmail: { msg: "Must be a valid email" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password cannot be empty" },
          len: { args: [8, 100], msg: "Password minimum 8 characters" },
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "student",
      },
      classId: DataTypes.INTEGER,
      phaseLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isRepeater: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        // [REQ-APP-6-Hooks] - Hash password before create
        beforeCreate: (user, options) => {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
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
          if (user.role === "student") {
            await sequelize.models.Profile.create(
              { userId: user.id },
              { transaction: options.transaction },
            );
          }
        },
      },
    },
  );
  return User;
};
