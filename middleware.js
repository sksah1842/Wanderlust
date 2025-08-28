const Listing = require('./MODELS/listing');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('./schema.js');
const Review = require('./MODELS/review.js'); 


module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req);
    if (!req.isAuthenticated()) {
    //redirecturl
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'Please login ');
    return res.redirect('/login');
  }
  next();
}; 

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next(); 
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }
  next();
}; 

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); 
  if (error){
    let errMsg= error.details.map((el) => el.message).join(', ');
    throw new ExpressError(400, errMsg );
  } else{
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
   if (error){
    let errMsg= error.details.map((el) => el.message).join(', ');
    throw new ExpressError(400, errMsg );
  } else{
    next();
  }
};

module.exports.isreviewAuthor = async (req, res, next) => {
  const { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currentUser._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }
  next();
}; 
