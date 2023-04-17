import jwt from "jsonwebtoken";
import appConfig from "./../common/appConfig";
import { chain } from "lodash";
import authServices from "../services/user.services";
const _ = { chain };


const user = (req, res, next) => {
  const token = _.chain(req).get("headers.authorization", "").replace("Bearer ", "").value();
  if (token) {

    // Validate token
    try {
      jwt.verify(token, appConfig.jwtSecretKey);

      // Match JTW with user table
      authServices.findByToken(token).then(data => {
        if (data.status === 200) {
          req.tokenUser = data.data;
          next();
        } else {
          res.status(401).send({ status: 401, message: "Invalid session" });
        }
      }).catch(error => {
        res.status(401).send({ status: 401, message: error.message });
      });

    } catch (error) {

      if (error.name === 'TokenExpiredError') {
        res.status(401).send({ status: 401, message: 'Token expired' });
      } else {
        res.status(401).send({ status: 401, message: error.message });
      }
    }

  } else {
    res.status(401).send({ status: 401, message: "No token provided" });
  }
}

const authMiddleware = {
  user,
}
export default authMiddleware;