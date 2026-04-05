import Listing from "../models/listing.model.js";
import errorHandler from "../utils/errorHandler.js";
export const createController = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListingController = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    next(errorHandler(401, "No listing found"));
    return;
  }
  if (req.user.id !== listing.userRef) {
    next(errorHandler(401, "You can only delete your listing"));
    return;
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};
export const updataListingController = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    next(errorHandler(404, "Listing not found"));
    return;
  }
  console.log(listing);
  if (listing.userRef !== req.user.id) {
    next(errorHandler(401, "You can only update your listing"));
    return;
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedListing);
  } catch (error) {
    console.error(errorHandler(500, error.message));
  }
};
export const getListingController = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  try {
    res.status(200).json(listing);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
export const getSearchListingController = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 9;
    const startIndex = req.query.startIndex
      ? parseInt(req.query.startIndex)
      : 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchItem = req.query.searchItem || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const listings = await Listing.find({
      name: { $regex: searchItem, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(listings);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
