'use strict';
const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.hasMany(models.User, { foreignKey: 'classId' });
    }
    // [REQ: Aplikasi - 2. Static method di model]
    // Static method requirement
    static async getActiveClasses(options = {}) {
      return await this.findAll({
        ...options,
        where: {
          phaseLevel: { [Op.gte]: 0 },
          ...options.where
        }
      });
    }
  }
  Class.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Class name is required" },
        notEmpty: { msg: "Class name cannot be empty" }
      }
    },
    phaseLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Phase level is required" },
        isIn: {
          args: [[0, 1, 2, 3]],
          msg: "Phase level must be between 0 and 3"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Class',
  });
  return Class;
};