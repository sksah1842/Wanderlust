const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../MODELS/listing');

const MONGO_URI = 'mongodb://localhost:27017/wanderlust';
async function connectDB() {
  await mongoose.connect(MONGO_URI);
    
};
connectDB().then(() => {
    console.log('Connected to MongoDB');
    })
    .catch((err) => {
    console.error('Error connecting to MongoDB', err);
});


const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
      ...obj,
      owner: '68a0650c9fd7bf892ca4ce45' // Replace with a valid user ID from your database
    }));
    await Listing.insertMany(initData.data);
    console.log('Data was initialized');



}
initDb();