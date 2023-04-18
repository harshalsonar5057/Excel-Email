"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
  var FileDetails = sequelize.define("fileDetails", {

    fileName: {
      type: Sequelize.STRING(200)
    },
    status: {
      type: Sequelize.STRING(30),
    },
    total_records: {
      type: Sequelize.INTEGER(10),
    },
    total_valid_records: {
      type: Sequelize.INTEGER(10),
    },

  },
    {
      tableName: "fileDetails",
      updatedAt: "updated_at",
      createdAt: "created_at"
    });

  return FileDetails;
};