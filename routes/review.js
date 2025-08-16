const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('../schema.js');
const Review = require('../MODELS/review.js'); 
const Listing = require('../MODELS/listing.js');

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
   if (error){
    let errMsg= error.details.map((el) => el.message).join(', ');
    throw new ExpressError(400, errMsg );
  } else{
    next();
  }
};

//reviews
//post route
router.post('/', validateReview,
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