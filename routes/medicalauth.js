var express = require('express');
var medicalauth = require('../controllers/medicalauth');
var medicalrequest = require('../controllers/medicalrequest');
var search = require('../controllers/donorsearch')
var router = express.Router();


router.get('/',medicalauth.checkToken,medicalauth.getall);
router.post('/register',medicalauth.register);
router.post('/login',medicalauth.login);
router.get('/logout',medicalauth.logout);

router.post('/search',medicalauth.checkToken,search.getneardonor);


router.get('/requests', medicalauth.checkToken, medicalrequest.getGeneratedRequests);
router.post('/requests/generate', medicalauth.checkToken, medicalrequest.generateRequest);

router.route('/requests/:req_id')
.all(medicalauth.checkToken)
.get(medicalrequest.getGeneratedRequestById)
.delete(medicalrequest.deleteGeneratedRequest);

router.get('/requests/:req_id/responses', medicalauth.checkToken, medicalrequest.getResponses);

module.exports = router;