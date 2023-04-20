"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
  var Users = sequelize.define("users", {

    userName: {
      type: Sequelize.STRING(200)
    },
    email: {
      type: Sequelize.STRING(30),
    },
    password: {
      type: Sequelize.STRING(70),
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

  return Users;
};