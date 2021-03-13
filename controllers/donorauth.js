const db=require('../models/donorsModel')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const config = require('../bin/config');

exports.register =  (req, res, next) => {
    
        db.create(req.body)
        .then((donor)=>
        {
            const { id, username } = donor;
            const token = jwt.sign({ id, username },config.secret);
            console.log(token);
            res.cookie("t", token, {
              expire: new Date() + 9999
            })
            donor.password=undefined;
            return res.status(201).json({ token , user: {...donor._doc,category:'donor'}
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
                donor.password=undefined
                return res.status(200).json({
                  user: {...donor._doc,category:'donor'},
                  token
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

exports.checkToken = (req, res, next)=>{
  //get token from request
  const token = req.get('Authorization').split(' ')[1];
  //verify token which is in cookie value
  jwt.verify(token,config.secret,(err,data)=>{ 
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