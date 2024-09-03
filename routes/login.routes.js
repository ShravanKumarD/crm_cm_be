const loginController = require('./../controllers/login.controller');
const express = require('express');

const router = express.Router();

router.post('/login',loginController.authenticate);
router.post('/signup', loginController.signup);
router.post('/forgot-password', loginController.forgotPassword);

module.exports=router;