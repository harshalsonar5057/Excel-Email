"use strict";

import Sequelize from "sequelize";
import dbHelper from "../common/dbHelper";

export default (sequelize, DataTypes) => {
  var Venders = sequelize.define(
    "venders",
    {
      venderName: {
        type: Sequelize.STRING(200),
      },
    },
    {
      tableName: "venders",
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
  Venders.associate = function (models) {
    models.venders.hasMany(models.fileDetails, {
      foreignKey: "vender_id",
    });
  };
  return Venders;
};
