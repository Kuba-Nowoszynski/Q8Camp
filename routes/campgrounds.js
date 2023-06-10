const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const { validate, isLoggedIn, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validate(campgroundSchema),
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor(Campground),
    upload.array("image"),
    validate(campgroundSchema),
    catchAsync(campgrounds.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor(Campground),
    catchAsync(campgrounds.deleteCampground)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(isAuthor(Campground)),
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
