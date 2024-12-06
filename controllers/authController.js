import { StatusCodes } from "http-status-codes";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import User from "../models/UserModel.js";
import { createJWT } from "../utils/tokenUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
export const register = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  // console.log(hashedPassword)
  const users = await User.count({});
  if (users == 0) {
    req.body.role = "admin";
  }
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: `user created..` });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // console.log(user)

  if (!user) throw new UnauthenticatedError("invalid credentials");

  const isPasswordCorrect = await comparePassword(req.body.password, user.password);
  if (!isPasswordCorrect) throw new UnauthenticatedError("invalid credentials");

  const oneDay = 1000 * 60 * 60 * 24;
  const token = createJWT({ userId: user._id, role: user.role, username: user.name });

  // Set the token in the cookie
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    sameSite: "None", // For cross-origin requests
  });

  // Send the token in the response body for localStorage
  res.status(StatusCodes.ACCEPTED).json({
    msg: `welcome ${user.name}`,
    token: token, // Send token in the response body
  });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
