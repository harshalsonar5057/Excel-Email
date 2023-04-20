import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import appConfig from "../common/appConfig";
import { commonStatuses } from "../common/appConstants";
import dbHelper from "../common/dbHelper";
import moment from "moment/moment";
import msgConst from "../common/msgConstants";
import { ASSET_IMAGES_DIR } from "../common/appConstants";
import bcrypt from "bcrypt";

// Create Vender
const createVender = async (data) => {
  let responseData = statusConst.error;
  try {
  
      const userPayload = {
        venderName: data.venderName || "",
        created_at: new Date(),
        updated_at: new Date(),
      };
      const user = await Models.venders.create(userPayload, { raw: true });
      const userId = user.id;

      if (!user) {
        throw new Error("Unable to create new vender");
      }

      responseData = { status: 200, message: "vender created successfully.", userId};


  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };

    if (["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error.name)) {
      errors = dbHelper.formatSequelizeErrors(error);
      responseData = { status: 422, message: 'Unable to process form request', errors };
    } else {
      responseData = { status: 400, message: error.message };;
    }
  }
  return responseData;
};









const UserServices = {
  createVender,
};

export default UserServices;