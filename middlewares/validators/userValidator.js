const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("username").trim().not().isEmpty().withMessage("username is missing!"),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email is missing!")
    .isEmail()
    .withMessage("emails should have correct format"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is missing!")
    .isLength({ min: 8 })
    .withMessage("passwords should have minimum 8 characters"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    res.status(401).json( {error: error[0].msg});
  }
  next();
};
