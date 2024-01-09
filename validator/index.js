const { body, validationResult } = require("express-validator");

exports.postValidator = [
  body("title")
    .notEmpty()
    .withMessage("Enter title")
    .isLength({ min: 4, max: 150 })
    .withMessage("Please enter a title that is between 4 and 150 characters"),
  body("body")
    .notEmpty()
    .withMessage("Enter body")
    .isLength({ min: 4, max: 2000 })
    .withMessage("Please enter a body that is between 4 and 2000 characters"),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        return res.status(400).json({
          error: firstError,
        });
      }
      next();
    } catch (error) {
      return res.json({ message: error });
    }
  },
];

exports.signinValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 3, max: 32 })
    .withMessage("Email must be between 3 to 32 characters"),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        return res.status(400).json({
          error: firstError,
        });
      }
      next();
    } catch (error) {
      return res.json({ message: error });
    }
  },
];
