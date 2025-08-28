const Listing = require('../MODELS/listing.js');

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({})
  res.render("./listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path: 'reviews',populate:{path:"author",},}).populate('owner');
  if(!listing) {
    req.flash('error', 'Listing does not exist!');
    return res.redirect('/listings');
  }
  
  res.render('listings/show.ejs', { listing });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash('error', 'Listing does not exist!');
    return res.redirect('/listings');
  }
  res.render('listings/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the listing!');
  res.redirect('/listings');
};
