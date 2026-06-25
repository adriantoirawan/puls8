'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    static associate(models) {
      Score.belongsTo(models.User, { foreignKey: 'userId' });
      Score.belongsTo(models.Task, { foreignKey: 'taskId' });
    }
  }
  Score.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "userId is required" }
      }
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "taskId is required" }
      }
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Score is required" }
      }
    }
  }, {
    sequelize,
    modelName: 'Score',
  });
  return Score;
};