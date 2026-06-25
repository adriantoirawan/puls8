'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsToMany(models.User, { through: models.Score, foreignKey: 'taskId' });
    }
  }
  Task.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Task name is required" },
        notEmpty: { msg: "Task name cannot be empty" }
      }
    },
    phase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Phase is required" }
      }
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Weight is required" }
      }
    }
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};