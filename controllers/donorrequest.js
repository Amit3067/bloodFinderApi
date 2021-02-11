const mongoose = require('mongoose');
const dmed = require('../models/medicalOrg');
const drequest = require('../models/requestModel');
const ddonor= require('../models/donorsModel');
const dpool = require('../models/requestPoolModel');

exports.incomingrequests = (req,res,next) => {
    dpool.aggregate([
      {
          $match: {
              donor: mongoose.Types.ObjectId(req.donor.id)
          }
      },
      {
          $lookup: {
              from: 'requests',
              localField: 'request',
              foreignField: '_id',
              as: 'donorrequest'
          }
      },
      {
          $unwind: '$donorrequest'
      },
      {
          $match: {
              $expr: {
                  $not: {
                      $and: [{$eq: ['$response','pending']}, {$eq: ['$donorrequest.status','close']}]
                  }
              }
          }
      },
      {
          $group: {
          _id: '$response',
          requests: {
              $addToSet: '$donorrequest'
          }
        }
      },
      {
          $replaceWith: {
              status: '$_id',
              requests: '$requests'
          }
          
      }
    ])
    .then(inbox => {
        res.status(200).json({
            inbox
        });
    }).catch(err => {
        throw err;
    });
}
let curid;
exports.acceptrequest = (req,res,next) => {
    const req_id= req.params.req_id;
    dpool.updateOne(

      {'_id':req_id},
      {$set: {
        "response":"accepted"
      }

     })
      .then((bre)=>{
          //console.log('response accepted');
      })
      .catch((err)=>{
        return next({status: 400,message: err.message})
      })
    dpool.find({
      '_id':req_id
    })
    .then((sreq)=>{
       console.log(sreq);
       curid=sreq[0].request;
       drequest.updateOne(
         {'_id':sreq[0].request},
        {$inc: {
          "claimed":1
        }
       })
       .then((breq)=>{
          drequest.updateOne(
            {$expr:{$lte:["$units", "$claimed"]}},
            {$set: {
              "status":"close"
            }
           })
            .then((bre)=>{
              res.status(200).json({
                bre
              });
            })
            .catch((err)=>{
              return next({status: 400,message: err.message})
            })
          })
        .catch((err)=>{
          return next({status: 400,message: err.message})
        })
    })
    .catch((err)=>{
      return next({status: 400,message: err.message})
    })
   
}

exports.rejectrequest= (req,res,next) =>{
  const req_id= req.params.req_id;
  
  dpool.updateOne(
    {'_id':req_id},
    {$set: {
      "response":"rejected"
    }
   })
    .then((bre)=>{
        res.status(200).json({
          bre
        });
       
    })
    .catch((err)=>{
      return next({status: 400,message: err.message})
    })
}