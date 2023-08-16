var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
const cors = require('cors');
var logger = require('morgan');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var signUpRouter = require('./routes/sign-up');
var signInRouter = require('./routes/sign-in');
var accountRouter = require('./routes/account');
var faqRouter = require('./routes/faq');

var app = express();

// allow all CORS
app.use(cors({ origin: '*' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {});

app.use(session({
  secret: 'SECRET',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/sign-in', signInRouter);
app.use('/account', accountRouter);
app.use('/faq', faqRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
