const express = require("express");
const router = express.Router();
const {
  registerUser,
  getMe,
  loginUser,
  logoutUser,
  refresh,
} = require("../controllers/user");
const { protect } = require("../middleware/auth");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/refresh", refresh);
router.get("/me", protect, getMe);

module.exports = router;
