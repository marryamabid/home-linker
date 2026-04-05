import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  updateUserController,
  deleteUserController,
  listingUserController,
  getContactController,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/update/:id", verifyUser, updateUserController);
router.delete("/delete/:id", verifyUser, deleteUserController);
router.get("/listings/:id", verifyUser, listingUserController);
router.get("/:id", verifyUser, getContactController);
export default router;
