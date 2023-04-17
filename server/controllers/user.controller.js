import userServices from "../services/user.services";
import { get, isEmpty, isObject, has, chain } from "lodash";
const _ = { get, isEmpty, isObject, has, chain };

// create user
export const createUser = async (req, res) => {
  const bodyData = _.get(req, "body", {});
  userServices.createUser(bodyData).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

// logout
export const logout = async (req, res, next) => {
  const bodyData = _.get(req, "tokenUser", {});
  userServices.logout(bodyData).then((result) => {
    res.status(200).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

// verify user by otp 
export const verifyOtp = async (req, res, next) => {
  const data = {
    userId: req.params.Id,
    otp: req.body.otp
  }
  userServices.verifyOtp(data).then((result) => {
    res.status(200).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

// Resend otp 
export const resendOtp = async (req, res, next) => {
  const mobile = req.body.mobile;
  userServices.resendOtp(mobile).then((result) => {
    res.status(200).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

// update user
export const updateUser = async (req, res) => {
  userServices.updateUser(req).then((result) => {
    res.status(200).send(result);
  })
    .catch((error) => {
      res.status(422).send({
        status: 422,
        message: error.message || "Something went wrong!",
      });
    });
};