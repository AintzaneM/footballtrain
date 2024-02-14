const { check, validationResult } = require("express-validator");


// !TODO - still need to check if auth is done via sessions or not
exports.isSignUp = (req, res, next) => {
    // checks if the user is logged in when trying to access a specific page
    if (req.session.user) {
      return res
        .status(403)
        .json({ errorMessage: "You are already registered in app" });
    }
    //req.user = req.session.user;
    next();
  };
  
exports.isLoggedIn = (req, res, next) => {
    // Check if the user is already logged in
    if (req.session.user) {
      return res.status(403).json({ errorMessage: "You are log in" });
    }
    // If the user is not log in, allow them to proceed
    next();
  };

  
  exports.emailAndpasswordValidator = [
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
  
  
  exports.emailAndpasswordValidate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
      res.status(401).json( {error: error[0].msg});
    }
    next();
  };