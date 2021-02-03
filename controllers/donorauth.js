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
 }