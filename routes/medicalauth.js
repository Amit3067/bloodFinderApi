var express = require('express');
var medicalauth = require('../controllers/medicalauth');
var medicalrequest = require('../controllers/medicalrequest');

var router = express.Router();


router.post('/register', medicalauth.register);
router.post('/login', medicalauth.login);
router.get('/logout', medicalauth.logout);

router.get('/requests', medicalrequest.getGeneratedRequests);
router.get('/requests', medicalrequest.generateRequest);
router.route('/requests/:req_id')
.get(medicalrequest.getGeneratedRequestById)
.delete(medicalrequest.deleteGeneratedRequest);

router.get('/request/:req_id/responses', medicalrequest.getResponses);
module.exports = router;