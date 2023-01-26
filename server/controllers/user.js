const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Token = require("../models/token");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    const tokens = generateTokens(user._id);

    await saveToken(user._id, tokens.refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 100,
      httpOnly: true,
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: tokens.accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // if (user) {
  //   res.status(201).json({
  //     token: generateToken(user._id),
  //   });
  // } else {
  //   res.status(400);
  //   throw new Error("Invalid user data");
  // }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const tokens = generateTokens(user._id);
    await saveToken(user._id, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: tokens.accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

exports.logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const token = await Token.deleteOne({ refreshToken });

  res.clearCookie("refreshToken");
  res.status(200).json(token);
});

// Generate access and refresh tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await Token.create({
    user: userId,
    refreshToken,
  });
  return token;
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  let userData;

  if (!refreshToken) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error("You haven't been in for a long time. Login again");
  }

  const tokenFromDb = await Token.findOne({ refreshToken });

  if (!userData || !tokenFromDb) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  const user = await User.findOne({ ...userData.id });

  if (user) {
    const tokens = generateTokens(user._id);
    await saveToken(user._id, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: tokens.accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});
