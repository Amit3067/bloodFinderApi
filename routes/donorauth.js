var express = require('express');
var donorauth = require('../controllers/donorauth')
var router = express.Router();
var donorrequests= require('../controllers/donorrequest')
router.get('/',donorauth.checkToken,donorauth.getall);
router.post('/register',donorauth.register);
router.post('/login',donorauth.login);
router.get('/logout',donorauth.logout);
router.get('/accept/:req_id',donorauth.checkToken,donorrequests.acceptrequest)
router.get('/reject/:req_id',donorauth.checkToken,donorrequests.rejectrequest)
router.get('/incoming',donorauth.checkToken,donorrequests.incomingrequests)
module.exports = router;