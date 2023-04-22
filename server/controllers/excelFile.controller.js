import excelServices from "../services/excelFile.services";
import { get, isEmpty, isObject, has, chain } from "lodash";
const _ = { get, isEmpty, isObject, has, chain };

// create user
export const uploadFile = async (req, res) => {
  excelServices.uploadFile(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};
export const readFile = async (req, res) => {
  excelServices.readFile(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};
export const sendEmail = async (req, res) => {
  excelServices.sendEmail(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const getPendingFile = async (req, res, next) => {
  excelServices.getPendingFile(req)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};