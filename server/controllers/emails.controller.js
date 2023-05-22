import userServices from "../services/emails.service";
import { get, isEmpty, isObject, has, chain } from "lodash";
const _ = { get, isEmpty, isObject, has, chain };

// create email
export const emailSent = async (req, res) => {
  const id = _.get(req, "params.id", 0);
  const bodyData = _.get(req, "body", {});
  userServices.emailSent(bodyData, id).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

// create template.
export const createTemplate = async (req, res) => {
  const bodyData = _.get(req, "body", {});
  userServices.createTemplate(bodyData).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    });
};