import errorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";

export default function verifyUser(req, res, next) {
  let token;

  // 1️⃣ Try to get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ Fallback to cookies
  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // attach verified user
    next();
  } catch (error) {
    return next(errorHandler(401, "Invalid token"));
  }
}
