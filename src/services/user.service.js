import { User } from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

//@desc     Get Auth User and Token
//@route    POST /api/users/login
//@access   Public
const postAuthUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        username: user.username,
        password: user.password,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      return res
        .status(401)
        .json({ message: "Username or Password is invalid." });
    }
  } catch (error) {
    console.error("Error with user login: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
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

export { postAuthUser, getAdminProfile, putUpdateAdmin };
