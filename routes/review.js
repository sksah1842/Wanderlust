const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../MODELS/review.js'); 
const Listing = require('../MODELS/listing.js');
const { validateReview, isLoggedIn } = require('../middleware.js');


//reviews
//post route
router.post('/', isLoggedIn, validateReview,
  wrapAsync(async (req, res) => {
  
  const { id } = req.params;
  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save(); 
  await listing.save();
  req.flash('success', 'Successfully created a new review!');
  res.redirect(`/listings/${listing._id}`);
}));

// delete review route
router.delete('/:reviewId', wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/listings/${id}`);
}));

module.exports = router;