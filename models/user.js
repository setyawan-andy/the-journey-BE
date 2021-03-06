'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.article, {
        as: "articles",
        foreignKey: {
          name: "idUser",
        },
      });

      user.hasMany(models.bookmark, {
        as: "bookmark",
        foreignKey: {
          name: "idUser"
        }
      });

      user.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "idUser"
        }
      });
    }
  }
  user.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};