const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');

const auth = require('./routes/auth.route');
const user = require('./routes/user.route');
const passport = require('passport');

const app = express();
app.use(expressValidator());
//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';


let port = 1234;

//app.configure(function() {
  app.use(cors());
  app.use(require('morgan')('dev'));
  app.use(express.static('public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser('secret'));
  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false,
  }));

  app.use(function (req, res, next) {
    res.locals.user = req.session.passport;
    next();
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(methodOverride('_method'));


//Models & Routes
require('./config/passport');

  //app.use(app.router);
  app.use('/', auth);
  app.use('/users', user);
  app.use("/public", express.static(path.join(__dirname, 'public')));

if(!isProduction) {
    app.use(errorHandler());
}

//Configure Mongoose
let dev_db_url = 'mongodb+srv://brijal:abcd1234@cluster0-kik0y.mongodb.net/fokochatapp';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});