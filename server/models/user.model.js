"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
  var Users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    fullName: {
      type: Sequelize.STRING(200)
    },
    image: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING(30),
    },
    otp: {
      type: Sequelize.INTEGER(200),
      allowNull: true,
    },
    mobile: {
      type: Sequelize.STRING,
      // allowNull: false,
      validate: {
        notEmpty: { msg: "mobile is required" },
        isUnique: dbHelper.isUnique("users", "mobile", {
          msg: "mobile is already in use"
        })
      },
    },
    isVerify: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    token: {
      type: Sequelize.TEXT,
    },
  },
    {
      tableName: "users",
      updatedAt: "updated_at",
      createdAt: "created_at"
    });

  Users.prototype.toJSON = function () {
    var values = Object.assign({}, this.get({ plain: true }));
    if (values.image) {
      let URL = "http://localhost:9000/api/" + values.image;
      values.image = URL
    }
    return values;
  }

  return Users;
};