const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// const morgan = require('morgan');

const app = express();

// Passport config
require("./config/passport")(passport);

// DB Config
var db = process.env.MONGODB_URI || "mongodb://localhost/test";

// Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Connect to Morgan
// app.use(morgan('dev')),

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// serving public folder
app.use(express.static('public'));
// app.use(express.static(__dirname + "/styles"));
// app.use(express.static(__dirname + "/js"));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("http://localhost:" + PORT));
