import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  createController,
  deleteListingController,
  updataListingController,
  getListingController,
  getSearchListingController,
} from "../controllers/listing.controllers.js";

const router = express.Router();

router.post("/create", verifyUser, createController);
router.delete("/delete/:id", verifyUser, deleteListingController);
router.post("/update/:id", verifyUser, updataListingController);
router.get("/getListing/:id", getListingController);
router.get("/search", getSearchListingController);

export default router;
