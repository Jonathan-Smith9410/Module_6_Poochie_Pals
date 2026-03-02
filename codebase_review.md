Problems found:


1. ./app.js lines 27-29:

app.use(session({
  secret: 'SECRET',
}));

Hardcoded secret


2. ./app.js lines 19-20:

// allow all CORS
app.use(cors({ origin: '*' }));

Apparently allows all websites access to the API - should be whitelisted domains only.


3. ./app.js lines 42-25:

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

Unsure if this is a vulnerability? WIll mean that default error handler is used?