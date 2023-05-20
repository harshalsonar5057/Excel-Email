import { log } from "console";
import venderServices from "../services/vender.services";
import { get, isEmpty, isObject, has, chain } from "lodash";
const _ = { get, isEmpty, isObject, has, chain };

// create user
export const createVender = async (req, res) => {
  const bodyData = _.get(req, "body", {});
  venderServices.createVender(bodyData).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const getSingleUser = async (req, res, next) => {
  const bodydata = _.get(req, "params.id", 0);
  venderServices.getSingleUser(bodydata).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const getvender = async (req, res) => {
  const bodydata = _.get(req, "params.id", 0);
  venderServices.getvender(bodydata).then((result) => {
    res.status(200).send(result);
  })
    .catch((error) => {
      res.status(422).send({
        status: 422,
        message: error.message || "Something went wrong!",
      });
    });
};

export const deleteVender = async (req, res) => {
  venderServices.deleteVender(req).then((result) => {
    res.status(200).send(result)
  }).catch((error) => {
    res.status(422).send({ status: 422, message: error.message || "Something went wrong!" });
  })
};

export const updaVender = async (req, res, next) => {
  venderServices.updaVender(req).then((result) => {
      res.status(result.status).send(result);
  }).catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};