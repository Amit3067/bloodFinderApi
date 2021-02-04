const db=require('../models/medicalOrg')
const dbdonor=require('../models/donorsModel')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const config = require('../bin/config');
exports.getneardonor =  (req, res, next) => {
    console.log(req);
    db.findOne({
      username: req.medOrg.username,
    })
    .then((medOrg)=>{
      dbdonor.aggregate([
        {
          $geoNear: {
             near: medOrg.location.coordinates,
             distanceField: "dist",
             maxDistance: req.body.mxdist,
             spherical: true
          }
        }
      ])
      .then((donors)=>
      {
          return res.status(200).json({donors});
      })
      .catch((err) => {
        return next({
          status: 400,
          message: err.message,
        });
      })
   })
   .catch ((err)=>{
      return next({ status: 400, message: 'Invalid Organisation' });
    }) 
  };