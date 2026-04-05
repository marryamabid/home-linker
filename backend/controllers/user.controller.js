import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import errorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";

export const updateUserController = async (req, res, next) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return next(errorHandler(403, "You can only update your own account"));
  }

  try {
    const updateFields = {};
    const { username, email, profileImage, password } = req.body;

    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (profileImage) updateFields.profileImage = profileImage;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    );

    const { password: _, ...userDetails } = updatedUser._doc;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userDetails,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const deleteUserController = async (req, res, next) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return next(errorHandler(403, "You can only delete your own account"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
export const listingUserController = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only view your own listings"));
  }
  try {
    const userListings = await Listing.find({ userRef: req.params.id });
    res.status(200).json({
      userListings,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
export const getContactController = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username email profileImage"
    );

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({ user });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
