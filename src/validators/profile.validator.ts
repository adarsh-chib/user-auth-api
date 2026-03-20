import { body } from "express-validator";

export const createProfileValidator = [
  body("bio")
    .notEmpty()
    .withMessage("bio is required")
    .isString()
    .withMessage("bio must be a string"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("phoneNumber is required")
    .isNumeric()
    .withMessage("phoneNumber must be a number"),

  body("address")
    .notEmpty()
    .withMessage("address is required")
    .isString()
    .withMessage("address must be a string"),

  body("avatar").optional().isString().withMessage("avatar must be a string"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("dateOfBirth is required")
    .isISO8601()
    .withMessage("dateOfBirth must be a valid date"),
];
