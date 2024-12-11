import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

// Middleware to authenticate the user based on the JWT token in cookies
export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError("Authentication invalid. Token is missing.");
  }

  try {
    const { userId, role } = verifyJWT(token); // Assuming verifyJWT decodes and verifies the token
    const testUser = userId === "64b2c07ccac2efc972ab0eca"; // Example test user ID

    req.user = { userId, role, testUser }; // Attach user details to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid. Token is invalid or expired.");
  }
};

// Middleware to authorize users based on their roles
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next(); // User has the correct role, proceed to the next middleware or route handler
  };
};

// Middleware to check if the user is a test/demo user
export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Demo User. Read-only access.");
  }
  next(); // User is not a test user, proceed to the next middleware or route handler
};

// Token verification middleware (for Authorization header)
export const verifyToken = (req, res, next) => {
  // console.log("Token verification middleware called");

  // Log headers to ensure the Authorization header is passed
  // console.log("Request headers:", req.headers);

  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  // console.log("Token received:", token); 
  // Log token value for debugging

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "No token provided" });
  }

  try {
    // Verify the token using JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach the decoded token (user info) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};
