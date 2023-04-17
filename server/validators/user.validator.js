import { body } from "express-validator";
import { get } from "lodash";

const _ = { get };

export const createUservalidation = () => {
  return [
    body("mobile")
      .not()
      .isEmpty()
      .withMessage("mobile is required")
      .isLength({ min: 4, max: 16 })
      .withMessage("enter valid mobile ")
    // .matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/)
    // .withMessage("Must contains at least digit & valid mobile number"),
  ];
};