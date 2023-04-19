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
    file_ref_id: {
      type: Sequelize.INTEGER(11),
    },
  },
    {
      tableName: "leads",
      updatedAt: "updated_at",
      createdAt: "created_at"
    });

    Leads.associate = function(models){
      models.leads.belongsTo(models.fileDetails,{
          foreignKey:"file_ref_id"
      })
  }
  return Leads;
};