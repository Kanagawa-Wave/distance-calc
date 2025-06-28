var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { x: null, y: null, z: null, distance: null, error: null });
});

app.post('/', (req, res) => {
  const { x, y, z } = req.body;

  const xi = parseFloat(x);
  const yi = parseFloat(y);
  const zi = parseFloat(z);

  if ([xi, yi, zi].some(n => Number.isNaN(n))) {
    return res.render('index', {
      x, y, z,
      distance: null,
      error: 'All three inputs must be numbers.'
    });
  }

  const d = Math.sqrt(xi * xi + yi * yi + zi * zi);

  res.render('index', {
    x: xi, y: yi, z: zi,
    distance: d.toFixed(3),
    error: null
  });
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
