const Med = require('../models/medicalOrg');
const Request = require('../models/requestModel');
const Pool = require('../models/requestPoolModel');

module.exports.getGeneratedRequests = (req,res,next) => {
    Request.aggregate([{$match: {medOrg: req.med.id}}, {$sort: {status:1, createdAt: -1}}]).then(reqs => {
        res.status(200).json({
            response: reqs
        });
    }).catch(err => {
        next(err);
    });
};

module.exports.generateRequest = (req,res,next) => {
    var newReq = {
        blood_group: req.body.blood_group,
        units: req.body.units,
        medOrg: req.med.id
    };
    var donors_list = req.body.donors_list;
    
    Request.insertMany(newReq).then(request => {
        var _id = request._id;
        var poolRequest = donors_list.map(donor => {
            return {
                donor: donor,
                request: _id
            };
        });
        Pool.insertMany(poolRequest).then(requests => {
            res.status(200).json({
                response: 'Request has been successfully created.'
            });
        }).catch(err => {
            Request.deleteOne({_id: _id});
            var error = new Error('Request could not be generated.');
            error.status = 400;
            throw error;
        })
    }).catch(err => {
        next(err);
    });
}

module.exports.getGeneratedRequestById = (req,res,next) => {
    Request.findById({_id: req.params.req_id, medOrg: req.med.id}).then(request => {
        if(!req){
            var error = new Error('No such request found!');
            error.code = 400;
            throw err;
        }
        else{
            res.status(200).json({
                response: request
            });
        }
    })
    .catch(err => {
        next(err);
    });
};

module.exports.deleteGeneratedRequest = (req,res,next) => {
    Request.deleteOne({_id: req.params.req_id, medOrg: req.med.id})
    .then(val => {
        console.log(val);
        res.status(200).json({
            response: val
        });
    })
    .catch(err => {
        next(err);
    });
};

module.exports.getResponses = (req,res,next) => {
    Request.find({_id: req.params.req_id, medOrg: req.med.id})
    .then(reqs => {
        if(!reqs){
            var error = new Error('No such request found!');
            error.code = 400;
            throw err;
        }
        else{
            Pool.aggregate([
                {$match: {
                    _id: req.params.req_id
                }},
                {$group: {
                    _id: '$status',
                    donors_list: {$addToSet: '$donor'}
                }},
                {$lookup: {
                    from: 'donors',
                    localField: 'donors_list',
                    foreignField: '_id',
                    pipeline: [
                        {$project: {name: 1, _id: 1, phone: 1}}
                    ],
                    as: 'donors'
                }},
                {$replaceWith: {
                    status: '$_id',
                    donors: '$donors'
                }}
            ]).then(responses => {
                res.status(200).json({
                    response: responses
                });
            }).catch(err => {
                throw err;
            });
        }
    }).catch(err => {
        next(err);
    });
};