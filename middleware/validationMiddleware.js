import { validationResult, body } from "express-validator";
import mongoose from "mongoose";
import { BadRequestError } from "../errors/customError.js";

const validationErrors = (values) => {
  return [
    values,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessage);
      }
      next();
    },
  ];
};

export const validateAdminRegisterInput = validationErrors([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must only contain letters."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
]);

export const validateAdminLoginInput = validationErrors([
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").trim().notEmpty().withMessage("password is required"),
]);
