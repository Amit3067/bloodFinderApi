var express = require('express');
var donorauth = require('../controllers/donorauth')
var router = express.Router();


router.post('/register',donorauth.register);
router.post('/login',donorauth.login);
router.get('/logout',donorauth.logout);
module.exports = router;