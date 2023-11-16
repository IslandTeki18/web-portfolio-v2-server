import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        req.user = await User.findById(decoded.id).select("-password");

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    console.error("Error Authorization: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const admin = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  } catch (error) {
    console.error("Error Authenticating: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { protect, admin };
