const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../MODELS/listing.js');
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');
const multer  = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage });

 
const listingController = require('../controllers/listings.js');

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,
  wrapAsync(listingController.createListing)
  );

//new route
router.get('/new', isLoggedIn,listingController.renderNewForm );

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing,
   wrapAsync(listingController.updateListing))
   .delete(isLoggedIn, isOwner, listingController.deleteListing );


//edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
 

module.exports = router;