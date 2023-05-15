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

// Create User
const createUser = async (data) => {
  let responseData = statusConst.error;
  try {
    //Create User
    const userPayload = {
      userName: data.userName || "",
      email: data.email || "",
      created_at: new Date(),
      updated_at: new Date(),
    };
    if (data.password) {
      const hashPassword = await bcrypt.hash(
        data.password,
        appConfig.bcryptSaltRound
      );
      userPayload["password"] = hashPassword;
    }
    const user = await Models.users.create(userPayload, { raw: true });
    const userId = user.id;

    if (!user) {
      throw new Error("Unable to create new user");
    }

    responseData = {
      status: 200,
      message: "user create successfully.",
      userId,
    };
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };

    if (
      ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
        error.name
      )
    ) {
      errors = dbHelper.formatSequelizeErrors(error);
      responseData = {
        status: 422,
        message: "Unable to process form request",
        errors,
      };
    } else {
      responseData = { status: 400, message: error.message };
    }
  }
  return responseData;
};

const login = async (req) => {
  let responseData = statusConst.error;
  let data = _.get(req, "body", {});
  try {
    let user = await Models.users.findOne({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      responseData = { ...statusConst.invalidEmail };
    }
    const password = data.password;
    const userPassword = _.get(user, "password", "");
    const validPassword = await bcrypt.compare(password, userPassword);
    if (validPassword !== true) {
      responseData = { ...statusConst.invalidEmail };
    }
    if (
      !_.isEmpty(user) &&
      _.isObject(user) &&
      validPassword === true &&
      !_.isEmpty(password)
    ) {
      const tokenData = await generateToken({
        id: user.id,
      });
      const userid = user.id;
      const token = _.get(tokenData, "token", null);
      if (token) {
        await user.update({ token });
        responseData = { ...statusConst.authSuccess, data: { token }, userid };
      }
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};

const updateUser = async (req) => {
  let responseData = statusConst.error;
  let data = _.get(req, "body", {});
  let Id = _.get(req, "params.Id", {});
  let filePath;
  let ImageName = "";
  try {
    let userData = await Models.users.findOne({ where: { id: Id } });
    if (!userData) {
      return { status: 404, message: "user not found" };
    } else {
      if (req.files) {
        let img = req.files.image;
        ImageName = `user-${Date.now().toString()}.${
          (img.mimetype || "image/jpeg/").split("/")[1] || "jpeg"
        }`;
        filePath = `${ASSET_IMAGES_DIR}${ImageName}`;
        // Move people profile image to public folder
        img.mv(filePath, (err) => {
          if (err) {
            responseData = { status: 200, message: msgConst.uploadFailed };
          }
        });
      }
      const userPayload = {
        fullName: data.fullName || "",
        email: data.email || "",
        image: ImageName,
      };
      userData.update({ ...userPayload });
      responseData = {
        status: 200,
        message: "user update Successfully",
        userPayload,
      };
    }
  } catch (error) {
    responseData = { status: 200, message: "Error" };
  }
  return responseData;
};

// LOGOUT
const logout = async (data) => {
  let responseData = statusConst.error;
  try {
    const Id = _.get(data, "id", "");
    let user = await Models.users.findOne({ where: { id: Id } });

    if (_.isEmpty(user)) {
      responseData = { status: 404, message: "User not found" };
    } else {
      user.update({ token: "" });
      responseData = { status: 200, message: "User logout Successfully" };
    }
  } catch (error) {
    responseData = { status: 404, message: error.message };
  }
  return responseData;
};

/**
 * Generate the Token based on User PK
 *
 * @param  Options Object
 * @return String Token with 12h expired date
 */
const generateToken = async (options = {}) => {
  let responseData = statusConst.error;
  const userId = _.get(options, "id", 0);
  const updateToken = _.get(options, "updateToken", false) || false;

  try {
    const userTableAttributes = [
      "id",
      "userName",
      "email",
      "updated_at",
      "created_at",
    ];
    // Find user by id
    let User = await Models.users.findOne({
      attributes: userTableAttributes,
      where: { id: userId },
    });

    if (_.isEmpty(User)) {
      return { status: 404, message: "User not found" };
    }
    let userData = User.get({ plain: true }) || {};
    userData = _.omit(userData, ["User"], "id", "password", "email");
    // Change the status and roles to string from integer
    userData.status = _.chain(commonStatuses)
      .find({ id: userData.status })
      .get("title", "")
      .value();
    // Generate JWT with payload
    const token = jwt.sign(userData, appConfig.jwtSecretKey);

    // Update the token
    if (updateToken == true) {
      await User.update({ token });
    }
    responseData = { status: 200, message: "Success", token };
  } catch (error) {
    responseData = { status: 404, message: "Error" };
  }
  return responseData;
};

// change Password
const findByToken = async (token) => {
  let responseData = statusConst.error;
  try {
    // Find user by token
    const User = await Models.users.findOne({
      where: {
        token: token,
      },
    });
    if (!_.isEmpty(User) && _.isObject(User)) {
      responseData = {
        status: 200,
        message: "Success",
        success: true,
        data: User,
      };
    } else {
      responseData = { status: 422, message: "user not found", success: false };
    }
  } catch (error) {
    responseData = { status: 422, message: error.message };
  }

  return responseData;
};

const getAlluser = async (data) => {
  let responseData = statusConst.error;
  try {
    const data = await Models.users.findAll();
    responseData = { status: 200, message: "data fetch successfully", data };
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };

    if (
      ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
        error.name
      )
    ) {
      errors = dbHelper.formatSequelizeErrors(error);
      responseData = {
        status: 422,
        message: "Unable to process form request",
        errors,
      };
    } else {
      responseData = { status: 400, message: error.message };
    }
  }
  return responseData;
};

const getSingleUser = async (req) => {
  let responseData = statusConst.error;
  let Id = _.get(req, "params.Id", {});
  try {
    let userData = await Models.users.findOne({ where: { id: Id } });
    if (!userData) {
      return { status: 404, message: "user not found" };
    } else {
      responseData = {
        status: 200,
        message: "user single get Successfully",
        userData,
      };
    }
  } catch (error) {
    responseData = { status: 200, message: "Error" };
  }
  return responseData;
};



const UserServices = {
  login,
  logout,
  generateToken,
  createUser,
  findByToken,
  updateUser,
  getAlluser,
  getSingleUser,
};

export default UserServices;
