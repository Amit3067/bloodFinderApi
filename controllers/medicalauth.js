const db=require('../models/medicalOrg')
const dbdonor=require('../models/donorsModel')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const config = require('../bin/config');
exports.register =  (req, res, next) => {
        console.log(req.body);
        db.create(req.body)
        .then((medOrg)=>
        {
            const { id, username } = medOrg;
            const token = jwt.sign({ id, username },config.secret);
            res.cookie("t", token, {
              expire: new Date() + 9999
            })
            medOrg.password=undefined;
            return res.status(201).json({ token , user: {...medOrg._doc, category: 'med'}
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
      .then((medOrg)=>{
        const { id, username } = medOrg;
        medOrg.comparePassword(req.body.password, function(err,valid) {
            if (err) throw err;
            console.log(valid);
            if (valid) 
            {
                const token = jwt.sign({ id, username },config.secret);
                res.cookie("t", token, {
                  expire: new Date() + 9999
                })
                medOrg.password=undefined;
                return res.status(200).json({
                  user: {...medOrg._doc, category: 'med'},
                  token
                });
            } else {
                return next({ status: 400, message: 'Invalid Password' });
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
    res.sendStatus(403);
  } 
  else if(data.username)
  {  
    console.log(data);
    req.medOrg = data  
    next();
  }
}) 
}
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
}

