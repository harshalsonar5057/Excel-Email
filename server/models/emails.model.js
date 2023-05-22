"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
  var emails = sequelize.define("themes", {
    content: {
      type: Sequelize.TEXT,
    },
    subject: {
      type: Sequelize.TEXT,
    },
    sincerely: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.STRING(30),
    },
  },
    {
      tableName: "themes",
      updatedAt: "updated_at",
      createdAt: "created_at"
    });
  return emails;
};