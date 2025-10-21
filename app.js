if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const express = require('express'); 
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./MODELS/user.js'); // Assuming you have a user model defined in user.js

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  touchAfter: 24 * 60 * 60, // time period in seconds
  crypto: {
    secret: process.env.SECRET,
  }
});

store.on("error", function(e){
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 day
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
};

// app.get('/', (req, res) => {
//   res.send("Hi i'm root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js'); // Assuming you have a user route defined in user.js

// const MONGO_URI = 'mongodb://localhost:27017/wanderlust';
const dburl = process.env.ATLASDB_URL;


async function connectDB() {
  await mongoose.connect(dburl);
    
};
connectDB().then(() => {
    console.log('Connected to MongoDB');
    })
    .catch((err) => {
    console.error('Error connecting to MongoDB', err);
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);  
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user; // Make current user available in all views
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User(
//     { email: "sumit@gmail.com",
//       username: "sumit"
// });
//   const registeredUser = await User.register(fakeUser, "sumit123");
//   res.send(registeredUser);
// });

app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter); // Use the user routes


app.all("*e", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode=500,message="Something got wrong!"} = err;
  res.status(statusCode).render("error.ejs", {err});
  // res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});