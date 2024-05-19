import { validationResult, param, body } from "express-validator";
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
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
]);

export const validateAdminUpdateInput = validationErrors([
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
]);

export const validateDate = validationErrors([
  body("start")
    .trim()
    .notEmpty()
    .withMessage("Start date is required")
    .bail()
    .isISO8601()
    .withMessage("Invalid  date format.Use ISO8601 format (YYYY-MM-DD)"),
  body("end")
    .trim()
    .notEmpty()
    .withMessage("End date is required")
    .bail()
    .isISO8601()
    .withMessage("Invalid  date format .Use ISO8601 format (YYYY-MM-DD)"),
]);

export const validateAddStudentInput = validationErrors([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must only contain letters."),
  body("studentId")
    .trim()
    .notEmpty()
    .withMessage("Student ID is required")
    .isNumeric()
    .withMessage("Student ID must only contain numbers")
    .isLength({ min: 6, max: 6 })
    .withMessage("Student ID must be 6 digits "),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female"])
    .withMessage("Invalid gender"),
]);

export const validateIdParam = validationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new Error("invalid MongoDB id");
  }),
]);

export const validateStudentInput = validationErrors([
  body("studentId")
    .trim()
    .notEmpty()
    .withMessage("Student ID is required")
    .isNumeric()
    .withMessage("Student ID must only contain numbers")
    .isLength({ min: 6, max: 6 })
    .withMessage("Student ID must be 6 digits "),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
]);

export const validateCandidateInput = validationErrors([
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone-number  is required")
    .isNumeric()
    .withMessage("phone-number must only contain numbers"),
  body("Age")
    .trim()
    .notEmpty()
    .withMessage("Age is required")
    .isNumeric()
    .withMessage("Age must be  number"),
  body("Department")
    .trim()
    .notEmpty()
    .withMessage("Department is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Department must only contain letters."),
  body("Campaign").trim().notEmpty().withMessage("Campaign is required"),
]);
