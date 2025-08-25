const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../MODELS/listing.js');
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');




// index route
router.get('/', wrapAsync(async (req, res) => {
  let allListing = await Listing.find({})
  res.render("./listings/index.ejs", { allListing });
  
}));

//new route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('listings/new.ejs');
});
// show route
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews').populate('owner');
  if(!listing) {
    req.flash('error', 'Listing does not exist!');
    return res.redirect('/listings');
  }
  
  res.render('listings/show.ejs', { listing });

}));
// create route
router.post('/', isLoggedIn, validateListing,
  wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');

}));

//edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash('error', 'Listing does not exist!');
    return res.redirect('/listings');
  }
  res.render('listings/edit.ejs', { listing });
}));
 
// update route
router.put('/:id', isLoggedIn, isOwner, validateListing,
   wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
})); 

// delete route
router.delete('/:id', isLoggedIn, isOwner, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the listing!');
  res.redirect('/listings');
});

module.exports = router;