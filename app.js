var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();

// Connect db

mongoose.connect("mongodb://localhost:27017/conduit", 
{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify : false, useCreateIndex:true},
(err) => {
    console.log('Connected:', err ? err : true);
})


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/articles');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/articles', articleRouter);

module.exports = app;
