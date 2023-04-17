import { each, isEmpty, startCase, get, isObject } from "lodash";
import models from "../models";
import statusConst from "../common/statusConstants";


const _ = { each, isEmpty, startCase, get, isObject }

/**
* Throw an unique field validation when requirement matches
*
*     const options = {
*        msg: Whether need to display explicit error message or not
*    }
*
*
* @param  String Modal name
* @param  String Field to be validated
* @param  Object See options object more for details
* @return Thrown an unique error Sequelize validation if criteria matches
*/
const isUnique = (modelName, field, options = {}) => {

  return function (value, next) {
    var model = models[modelName];

    // Validate the field only if has any value
    if (!_.isEmpty(value)) {
      var query = {};
      query[field] = value;

      // Check if error message is passed
      const errorMessage = _.get(options, "msg", `${_.startCase(field)} is already in use`);
      model.findOne({ where: query, attributes: ["id"] }).then(function (obj) {
        if (!_.isEmpty(obj)) {
          next(errorMessage);
        } else {
          next();
        }
      }).catch((e) => {
        next(`Unexpected error ${e.message}`);
      });
    } else {
      next();
    }
  };
}

/**
* Format the Sequelize error instance object to readable format
* 
* Custom thrown exceptions will always have higher priority
*
* @param  Instance SequelizeValidationError
* @return Formatted error messages in Object form
*/
const formatSequelizeErrors = (errorsObject) => {
  let errors = {};

  _.each((errorsObject.errors || []), function (e) {
    const field = _.get(e, "path", "");
    const message = _.get(e, "message", "");

    if (!_.isEmpty(field) && !_.isEmpty(message)) {
      errors[field] = message;
    }
  });

  // Check if custom exception is thrown
  if (errorsObject.customThrow) {
    const field = _.get(errorsObject, "path", "");
    const message = _.get(errorsObject, "message", "");
    errors[field] = message;
  }

  return errors;
}


/**
 * Find professional by Token
 *
 * @param String JWT token
 */
const findByToken = async (token, type) => {
  let responseData = { ...statusConst.notFound, message: "professional not found" };
  console.log({ token, type });
  try {
    // Find professional by token
    let tokendata;
    if (type == 'User') {
      tokendata = await models.User.findOne({
        where: {
          token: token,
        },
      });
    } else if (type == 'professional') {
      tokendata = await models.professional.findOne({
        where: {
          token: token,
        },
      });
    }
    if (!_.isEmpty(tokendata) && _.isObject(tokendata)) {
      responseData = { ...statusConst.success, data: tokendata };
    } else {
      responseData = { ...statusConst.notFound, message: `${type} not found` };
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }

  return responseData;
};

const dbHelper = {
  isUnique,
  formatSequelizeErrors,
  findByToken

};

export default dbHelper;