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
