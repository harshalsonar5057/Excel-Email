'use strict';
import fs from 'fs';
import path from 'path';
import notifier from "node-notifier";
import Sequelize from 'sequelize';
import { get } from "lodash";

var basename = path.basename(__filename);
const _ = { get };
var db = {};

const HOST = _.get(process, "env.DB_HOST", "localhost");
const USERNAME = _.get(process, "env.DB_USERNAME", "koliiybg_chatting_calling_system");
const PASSWORD = _.get(process, "env.DB_PASSWORD", "chatting_calling_system@DB#123");
const DATABASE = _.get(process, "env.DB_DATABASE", "koliiybg_chatting_calling_system");
const ENV = _.get(process, "env.APP_ENV", "local");
const TIME_ZONE = "+05:30";

var sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: 'mysql',
  logging: ENV === 'local' ? console.log : false,
  logging: true,
  dialectOptions: {
    // useUTC: false, //for reading from database
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: function (field, next) { // for reading from database
      if (field.type === 'DATETIME') {
        return field.string()
      }
      return next()
    },
  },
  timezone: TIME_ZONE
});


try {
  // Attempt to connect to the database
  sequelize.authenticate()
    .then(conn => {
      console.log("Connection has been established successfully");
      if (ENV === 'local') {
        notifier.notify({
          title: "Success",
          message: "🔥 Successfully compiled files..."
        });
      }
    })
    .catch(err => console.error("Unable to connect to the database:", err));
} catch (error) {
  console.error('Unable to connect to the database:', error.message);
}

// Import all models and its relationships
fs.readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-9) === '.model.js');
}).forEach(file => {
  var model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;


// drop the table if it already exists

/* db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
}); */

// The export will have all initialized Models + sequelize connection + Sequelize Object it self
export default db;