const express = require('express');
const router = express.Router();
const auth = require('./auth');

const user_controller = require('../controllers/user.controller');

router.get('/getuser',user_controller.user);
router.post('/deleteuserhistory',user_controller.history_delete);
router.post('/deletegroupuserhistory',user_controller.group_history_delete);
router.post('/getuserhistory',user_controller.userhistory);
router.post('/addgroupusers',user_controller.addgroupuser);
router.post('/getgroupusers',user_controller.groupuser);
router.post('/getgroups',user_controller.groups);
router.post('/getgroupuserhistory',user_controller.usergrouphistory);
router.post('/addhistory',user_controller.addhistory);
router.post('/addgrouphistory',user_controller.addgrouphistory);
module.exports = router;
