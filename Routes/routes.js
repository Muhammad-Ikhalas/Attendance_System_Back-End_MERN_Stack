const express = require('express');
const check_auth = require('../middleware/check-auth')
const controllers = require('../Controllers/controllers');
// const check_auth  = require('../middleware/check-auth');
const router= express.Router();
router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);
router.use(check_auth);
router.post('/present', controllers.present)
router.post('/leave', controllers.leave)
router.get('/getstudentrequests/:id', controllers.getStudentRequests)
router.get('/getadminrequests', controllers.getAdminRequests)
router.post('/acceptRequest/:id', controllers.acceptRequest)
router.post('/rejectRequest/:id', controllers.rejectRequest)

module.exports = router;
