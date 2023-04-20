import LeadServices from "../services/lead.services";
import { get, isEmpty, isObject, has, chain } from "lodash";
const _ = { get, isEmpty, isObject, has, chain };

// create user
export const count = async (req, res) => {
  const bodyData = _.get(req, "body", {});
  LeadServices.count(bodyData).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({ status: 422, message: err.message || "Something went wrong!" });
    }); 
};
