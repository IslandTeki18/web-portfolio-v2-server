import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "15m" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: "7d" });
};

const refreshAuthToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error: ", error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

//@desc     Get Auth User and Token
//@route    POST /api/users/login
//@access   Public
const postAuthUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      _id: user._id,
      username: user.username,
      password: user.password,
      isAdmin: user.isAdmin,
      token,
      refreshToken,
    });
  } else {
    return res
      .status(401)
      .json({ message: "Username or Password is invalid." });
  }
};

//@desc     Get admin profile
//@route    GET /api/users/profile/:id
//@access   Private
const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found." });
    }
    return res.json({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error with getting user profile: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Update User Settings
//@route    PUT /api/users/profile/settings
//@access   Private/Admin
const putUpdateAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found." });
    }

    user.username = username || user.username;

    if (password) {
      user.password = password;
    }

    const updatedAdmin = await user.save();

    return res.json({
      _id: updatedAdmin._id,
      username: updatedAdmin.username,
      isAdmin: updatedAdmin.isAdmin,
      token: generateToken(updatedAdmin._id),
    });
  } catch (error) {
    console.error("Error with updating user: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { postAuthUser, getAdminProfile, putUpdateAdmin, refreshAuthToken };
