const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { accessSecret } = require("../config/config");

const protect = asyncHandler(async (req, res, next) => {
  let accessToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      accessToken = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(accessToken, accessSecret);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!accessToken) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = {
  protect,
};
