var express = require('express');
var medicalauth = require('../controllers/medicalauth')
var router = express.Router();


router.post('/register',medicalauth.register);
router.post('/login',medicalauth.login);
router.get('/logout',medicalauth.logout);
module.exports = router;