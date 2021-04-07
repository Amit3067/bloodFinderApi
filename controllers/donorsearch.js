const db=require('../models/medicalOrg')
const dbdonor=require('../models/donorsModel')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const config = require('../bin/config');
let arr;
function getblood(blood)
{
  if(blood=='O+')
  {
    arr=['O+','O-'];
  }
  else if(blood=='A+')
  {
    arr=['A+', 'A-', 'O+', 'O-']
  }
  else if(blood=='B+')
  {
    arr=['B+', 'B-', 'O+', 'O-']
  }
  else if(blood=='AB+')
  {
    arr=['A+', 'A-', 'O+', 'O-','B+', 'B-','AB+','AB-']
  }
  else if(blood=='O-')
  {
    arr=['A-', 'O-'];
  }
  else if(blood=='A-')
  {
    arr=['A-','O-'];
  }
  else if(blood=='B-')
  {
    arr=['B-', 'O-'];
  }
  else
  {
    arr=['AB-', 'A-', 'B-', 'O-'];
  }
}
exports.getneardonor =  (req, res, next) => {
    //console.log(req);
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
        getblood(req.body.blood);
        //console.log(req.body.blood);
        var availdonors = new Array();
        donors.map((donor)=>{
          if(arr.find((bgroup) => bgroup == donor.blood_group))
          {
            availdonors.push(donor);
            //console.log(donor.blood_group);
          }
        })
        return res.status(200).json({availdonors});
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