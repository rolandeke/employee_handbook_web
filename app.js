require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const adminRoute = require("./routes/admin/adminRoute");
const helmet = require('helmet')
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("express-flash");
const passport = require("passport");


const app = express();
app.use(helmet())
const store = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: "sessions",
});
 
//Pasport 
require("./auth/passport")(passport);
//PATH TO STATIC FOLDERS
app.use(express.static(`${__dirname}/public`));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//EXPRESS EJS LAYOUT MIDDLEWARE
app.use(expressLayout);
app.set("view engine", "ejs");


//Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.err_msg = req.flash("err_msg");
  res.locals.error = req.flash("error");
  next();
});


//All Routes to be used by the appliaction
app.use("/", adminRoute); 







//PORT NUMBER FOR APP TO LISTEN
const Port = process.env.PORT || 5000;
app.listen(Port, (err) => {
  console.log(` http://localhost:${Port}`);
});
