import errorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";
export default function verifyUser(req, res, next) {
  console.log("Authorization Header:", req.headers.authorization);
  const token = req.cookies.token;
  console.log("Token from cookies:", token);
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("User verified:", user);
    req.user = user;
    return next();
  } catch (error) {
    return next(errorHandler(401, error.message));
  }
}
