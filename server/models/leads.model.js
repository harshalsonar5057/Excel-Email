"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
  var Leads = sequelize.define("leads", {

    email: {
      type: Sequelize.STRING(30)
    },
    title: {
      type: Sequelize.STRING(30),
    },
    status: {
      type: Sequelize.STRING(30),
    },

  },
    {
      tableName: "leads",
      updatedAt: "updated_at",
      createdAt: "created_at"
    });

  return Leads;
};