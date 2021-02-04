var express = require('express');
var medicalauth = require('../controllers/medicalauth')
var donorsearch = require('../controllers/donorsearch')
var router = express.Router();

router.get('/',medicalauth.checkToken,medicalauth.getall);
router.post('/register',medicalauth.register);
router.post('/login',medicalauth.login);
router.get('/logout',medicalauth.logout);
router.post('/search',medicalauth.checkToken,donorsearch.getneardonor);
module.exports = router;