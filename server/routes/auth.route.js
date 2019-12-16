const express = require('express');
const router = express.Router();
const auth = require('./auth');
const user_controller = require('../controllers/user.controller');

router.post('/login',auth.optional, user_controller.login);
router.post('/register',auth.optional, user_controller.register);

module.exports = router;