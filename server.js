const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const User = require('./module/user');
const config = require('./config');
const api = express.Router();

const app = express();

mongoose.connect(config.database);
app.set('secret',config.secret);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/',function (req,res) {
    res.send('hello world')
});

app.get('/setup',function (req,res) {
    var addyyou = new User({
        name:'liyan',
        password:'12345678',
        admin:true
    });
    addyyou.save(function (err) {
        if(err){
            throw err;
        }
        console.log('User saved successfully');
        res.json({success:true})
    })
});



api.post('/authenticate',function (req,res) {
    User.findOne({name:req.body.name},function (err,user) {
        if(err){
            throw err;
        }
        if(!user){
            res.json({success:false,message:'authenticate failed,user not find!'})
        }else if(user){
            if(user.password !== req.body.password){
                res.json({success:false,message:'authenticate failed,Wrong password'})
            }else{
                var token = jwt.sign(user,app.get('secret'),{ //设置验证信息
                    expiresIn:60*60*224
                });
                res.json({
                    uccess:true,
                    message:'Enjoy your token',
                    token:token
                })
            }
        }

    })
});

api.use(function (req,res,next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,app.get('secret',function (err,decoded) {
            if(err){
                return res.json({success:false,message:'Failed to authenicate token'});
            }else{
                req.decoded = decoded;
                next();
            }
        }))
    }else{
        return res.status(403).send({
            success:true,
            message:'No token provided'
        })
    }
})

api.get('/users',function (req,res) {
    User.find({},function (err,result) {
        res.json(result);
    })
});

app.use('/api',api);

app.listen(3000,function () {
    console.log('server started at port:3000')
});