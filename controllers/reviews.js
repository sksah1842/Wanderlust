const Listing = require('../MODELS/listing.js');
const Review = require('../MODELS/review.js');

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save(); 
  await listing.save();
  req.flash('success', 'Successfully created a new review!');
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/listings/${id}`);
};