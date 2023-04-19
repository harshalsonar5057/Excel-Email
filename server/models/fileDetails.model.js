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
    vender_id: {
      type: Sequelize.INTEGER(11),
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
    
    FileDetails.associate = function(models){
      models.fileDetails.belongsTo(models.venders,{
          foreignKey:"vender_id"
      })
  }
  FileDetails.associate = function (models) {
    models.fileDetails.hasMany(models.leads, {
      foreignKey: "file_ref_id",
    });
  };
  return FileDetails;
};