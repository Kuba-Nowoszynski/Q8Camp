const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
const { validate, isLoggedIn, isAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post(
  "/",
  isLoggedIn,
  validate(reviewSchema),
  catchAsync(reviews.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor(Review),
  catchAsync(reviews.deleteReview)
);

module.exports = router;
