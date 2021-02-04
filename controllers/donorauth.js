const db=require('../models/donorsModel')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const config = require('../bin/config');

exports.register =  (req, res, next) => {
        console.log(req.body);
        db.create(req.body)
        .then((donor)=>
        {
            const { id, username } = donor;
            const token = jwt.sign({ id, username },config.secret);
            console.log(token);
            res.cookie("t", token, {
              expire: new Date() + 9999
            })
            return res.status(201).json({ token , donor
            });
        })
        .catch((err) => {
          if(err.code === 11000) 
          {
            err.message = 'Sorry, that username is already taken';
          }
          return next({
            status: 400,
            message: err.message,
          });
      })
};

exports.login = (req, res, next) => {
      db.findOne({
        username: req.body.username,
      })
      .then((donor)=>{
        const { id, username } = donor;
        donor.comparePassword(req.body.password, function(err,valid) {
            if (err) throw err;
            console.log(valid);
            if (valid) 
            {
                const token = jwt.sign({ id, username }, config.secret);
                res.cookie("t", token, {
                  expire: new Date() + 9999
                })
                return res.status(200).json({
                  id,
                  username,
                  token,
                });
            } else {
                return next({ status: 400, message: 'Invalid Username/Password' });
            }
        })
     })
     .catch ((err)=>{
        return next({ status: 400, message: 'Invalid Username/Password' });
     }) 
 };

exports.logout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
      message: "You have signed out"
    })
};

exports.checkToken = (req, res, next)=>{
  //get authcookie from request
  const authcookie = req.cookies.t;
  //verify token which is in cookie value
  jwt.verify(authcookie,config.secret,(err,data)=>{ 
  if(err)
  {   
    res.sendStatus(403) 
  } 
  else if(data.username)
  {  
    req.donor = data   
    next();
  }
}) 
};

exports.getall = async (req, res) => {
  try {
    const users = await db.find();

    return res.status(200).json(users);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};