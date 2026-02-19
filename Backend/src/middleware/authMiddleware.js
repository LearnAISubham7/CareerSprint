import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    // ✅ token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized (cookie missing)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized (invalid cookie)" });
  }
};

export default protect;
