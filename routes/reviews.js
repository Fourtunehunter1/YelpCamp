const express = require("express");
const router = express.Router({ mergeParams: true }); // Need to set mergeParams to true in order to use some params for our reveiws
// But solely need it for our reveiws, not for our campground for some weird coding reason
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;