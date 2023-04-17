import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain };
import Models from "../models";
import appConfig from "../common/appConfig";
import { commonStatuses } from "../common/appConstants";
import dbHelper from "../common/dbHelper";
import axios from "axios";
import moment from "moment/moment";
import msgConst from "../common/msgConstants";
import { ASSET_IMAGES_DIR } from "../common/appConstants";
const client = require('twilio')

// Create User
const createUser = async (data) => {
  let responseData = statusConst.error;
  try {
    const userDetails = await Models.users.findOne({ where: { mobile: data.mobile } });
    const usermobile = data.mobile;

    //Send otp
    const otp = await createotp(usermobile)

    if (userDetails) {
      //Update User
      const userPayload = {
        otp: otp || ""
      };

      await userDetails.update(userPayload);
      const userId = userDetails.id;

      responseData = { status: 200, message: "OTP sent! Check your mobile for otp verification", userId, mobile: data.mobile };
    } else {

      //Create User
      const userPayload = {
        mobile: data.mobile || "",
        otp: otp || "",
        isVerify: false,
      };

      const user = await Models.users.create(userPayload, { raw: true });
      const userId = user.id;

      if (!user) {
        throw new Error("Unable to create new user");
      }

      responseData = { status: 200, message: "user create successfully. Check your mobile for otp verification", userId, mobile: data.mobile };

    }
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

// using 2factor for otp 

// const createotp = async (usermobile) => {
//   let responseData = statusConst.error;
//   let apikey = "2fdc5e7f-8678-11ed-9158-0200cd936042"

//   try {
//     const otp = Math.floor(1000 + Math.random() * 9000);
//     let res = await axios.get(`https://2factor.in/API/V1/${apikey}/SMS/${usermobile}/${otp}`);
//     const data = res.data;
//     return { data, otp }
//   } catch (error) {
//     responseData = { status: 401, message: 'not found' };
//   }
// };

// WITH USING TWILLIO

const createotp = async (usermobile) => {
  const accountSid = 'ACd064dc9d12fa65699444762b53c56101';
  const authToken = '1449778dd564b9c3b281bad1719110fa';
  const twilioNumber = '+15404101353';
  const client = require('twilio')(accountSid, authToken);
  try {
    // Generate a random 5-digit OTP
    const otp = Math.floor(10000 + Math.random() * 9000);

    // Send the OTP to the user's phone number using Twilio
    const message = await client.messages.create({
      body: `Your OTP is ${otp}.`,
      from: twilioNumber,
      to: usermobile
    });

    console.log(`OTP sent to ${usermobile}. Message SID: ${message.sid}`);
    return otp;
  }
  catch (err) {
    console.error(err);
    // throw new Error('Failed to send OTP');
    //Send default OTP
    return 12345
  }
};

const updateUser = async req => {
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
        ImageName = `user-${Date.now().toString()}.${((img.mimetype || "image/jpeg/").split('/')[1]) || 'jpeg'}`;
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
      responseData = { status: 200, message: 'user update Successfully', userPayload };
    }
  } catch (error) {
    responseData = { status: 200, message: 'Error' };
  }
  return responseData;
};

const verifyOtp = async (req) => {
  let responseData = statusConst.authError;
  let verificationTime = new Date();
  try {
    const userId = req.userId;
    const otp = req.otp;
    const userDetail = await Models.users.findOne({ where: { id: userId } });
    const createdAt = moment(userDetail.updated_at)
    const currentDate = moment();
    const returnDate = moment(createdAt).add(2, 'minutes')
    if (userDetail) {
      if (returnDate > currentDate) {

        const userId = _.get(userDetail, "id", "");
        if (userDetail.otp === parseInt(otp)) {

          const tokenData = await generateToken({
            id: userId,
          });
          const token = _.get(tokenData, "token", null);
          if (token) {
            await userDetail.update({ token });
            responseData = { status: 200, message: 'Login successful', data: { token }, userId };
          }

          userDetail.update({ isVerify: 1 });
          responseData = { status: 200, message: "otp verify successfully.", data: { token }, userId };

        } else {
          throw new Error("Invalid otp");
        }
      } else {
        throw new Error("otp is expired");
      }
    } else {
      throw new Error("user not found");
    }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };
  }
  return responseData;
};

const resendOtp = async (mobile) => {
  let responseData = statusConst.error;
  try {
    const userData = await Models.users.findOne({ where: { mobile: mobile } });
    if (userData) {
      const userMobile = userData.mobile;
      const updateOtp = await createotp(userMobile)
      const userPayload = {
        otp: updateOtp
      };
      await userData.update(userPayload);
      responseData = { status: 200, message: 'Otp sent successfully' };
    } else {
      responseData = { status: 404, message: 'User not found' };
    }
  } catch (error) {
    responseData = { status: 404, message: 'Error' };
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
      user.update({ token: "", });
      responseData = { status: 200, message: "User logout Successfully", };
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
    // Add associated modules
    let userTableAttributes = [
      "id",
      "otp",
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
    userData = _.omit(userData, ["User"], "id", "password", "email", "address");
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
    responseData = { status: 200, message: 'Success', token };
  } catch (error) {
    responseData = { status: 404, message: 'Error' };
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
      responseData = { status: 200, message: "Success", success: true, data: User };
    } else {
      responseData = { status: 422, message: "user not found", success: false };
    }
  } catch (error) {
    responseData = { status: 422, message: error.message };
  }

  return responseData;
};

const UserServices = {
  logout,
  generateToken,
  createUser,
  verifyOtp,
  resendOtp,
  findByToken,
  updateUser
};

export default UserServices;