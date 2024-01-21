const express=require('express');
const router=express.Router();
const emailController = require('../controller/passwordretrive');
const authController = require('../middleware/auth');

router.post('/password/forgotpassword' , emailController.sendEmail);
router.get('/forgetPassword/getUUID'  ,authController.authenticate , emailController.getUUID);
router.get('/password/resetpassword/:uuid', emailController.getForgetPasswordPage);
router.post('/resetPassword' ,authController.authenticate, emailController.updatePassword);

module.exports = router;