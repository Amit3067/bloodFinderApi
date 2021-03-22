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
          $lookup: {
            from: 'medorgs',
            let: {org_id: '$donorrequest.medOrg'},
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id','$$org_id']
                  }
                }
              },
              {
                $project: {name:1, location:1, phone:1, email:1}
              }
            ],
            as: "donorrequest.medOrg"
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
        console.log(inbox);
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
    
    const filter = {
      'donor': (req.donor.id),
      'request': (req_id)
    };
    
    dpool.updateOne(
          filter,
          {$set: {
            "response":"accepted"
          }
      })
      .then((bre)=>{
          console.log('response accepted');
      })
      .catch((err)=>{
        return next({status: 400,message: err.message})
    })
    dpool.find(
      filter
    )
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
            //console.log(breq);
            drequest.updateOne(
              {'_id':sreq[0].request,$expr: { $lte: [ "$units" , "$claimed" ] } },
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
  const filter = {
    'donor': (req.donor.id),
    'request': (req_id)
  };
  dpool.updateOne(
    filter,
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