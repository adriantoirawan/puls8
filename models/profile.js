'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Profile.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "userId is required" }
      }
    },
    learningStyle: {
      type: DataTypes.STRING,
      defaultValue: 'Unassessed'
    },
    gritLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    discordHandle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};