const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
var User = require('./module/user');
const config = require('./config');

const app = express();

mongoose.connect(config.database);
app.set('secret',config.secret);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/',function (req,res) {
    res.send('hello world')
})

app.listen(3000,function () {
    console.log('server started at port:3000')
});