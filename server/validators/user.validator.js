import { body } from "express-validator";
import { get } from "lodash";

const _ = { get };

//  CreateUser
export const userCreateValidation = [
  body("userName").not().isEmpty()
  .withMessage("userName is required"),
  body("email").not().isEmpty().withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email address is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({
      min: 4,
      max: 16,
    })
    .withMessage("Password must be between 4 to 16 characters")
    .matches(/^(?=.*[a-z])(?!.* )(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage("Must contains upper case, lower case, digit, special character"),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and Confirm password does not match");
      }
      return true;
    }),
 
];

export const loginValidation = [
  body("email").not().isEmpty().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];
export const venderCreateValidation = [
  body("venderName").not().isEmpty()
  .withMessage("venderName is required"),
 
];