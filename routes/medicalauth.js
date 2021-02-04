var express = require('express');
<<<<<<< HEAD
var medicalauth = require('../controllers/medicalauth')
var donorsearch = require('../controllers/donorsearch')
=======
var medicalauth = require('../controllers/medicalauth');
var medicalrequest = require('../controllers/medicalrequest');

>>>>>>> 8db638cbb36a7a662b24b2229195aa9891e083c3
var router = express.Router();


router.get('/',medicalauth.checkToken,medicalauth.getall);
router.post('/register',medicalauth.register);
router.post('/login',medicalauth.login);
router.get('/logout',medicalauth.logout);
<<<<<<< HEAD
router.post('/search',medicalauth.checkToken,donorsearch.getneardonor);
=======

router.get('/requests', medicalauth.checkToken, medicalrequest.getGeneratedRequests);
router.post('/requests/generate', medicalauth.checkToken, medicalrequest.generateRequest);

router.route('/requests/:req_id')
.all(medicalauth.checkToken)
.get(medicalrequest.getGeneratedRequestById)
.delete(medicalrequest.deleteGeneratedRequest);

router.get('/requests/:req_id/responses', medicalauth.checkToken, medicalrequest.getResponses);

>>>>>>> 8db638cbb36a7a662b24b2229195aa9891e083c3
module.exports = router;