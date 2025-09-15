const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;
const review = require('./review.js'); // Assuming you have a reviewSchema defined in schema.js 

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image:{
      url: String,
      filename: String
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country : { type: String, required: true }
    ,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',

}],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        
    }
    });

listingSchema.post('findOneAndDelete', async (listing)=> {
  if (listing){
    await review.deleteMany({_id: { $in: listing.reviews } });
      
  }});    
const Listing = mongoose.model('listing', listingSchema);
module.exports = Listing;    
