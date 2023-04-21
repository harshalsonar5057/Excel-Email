import LeadServices from "../services/lead.services";
import { get, isEmpty, isObject, has, chain } from "lodash";
const _ = { get, isEmpty, isObject, has, chain };

// create user
export const count = async (req, res) => {
  const bodyData = _.get(req, "body", {});
  LeadServices.count(bodyData)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

// get leads details
export const getLeads = async (req, res, next) => {
  LeadServices.getLeads(req)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

// update status
export const updateStatus = async (req, res, next) => {
  LeadServices.updateStatus(req)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};
