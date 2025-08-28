const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../MODELS/review.js'); 
const Listing = require('../MODELS/listing.js');
const { validateReview, isLoggedIn, isreviewAuthor } = require('../middleware.js');

const reviewController = require('../controllers/reviews.js');

//reviews
//post route
router.post('/', isLoggedIn,validateReview,
  wrapAsync(reviewController.createReview));

// delete review route
router.delete('/:reviewId', isLoggedIn, isreviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;