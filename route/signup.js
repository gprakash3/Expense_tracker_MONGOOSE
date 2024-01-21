const express=require('express');
const router=express.Router();

const signController = require('../controller/signup');

router.get('/expense', signController.getExpensePage);
router.get('/getForgetPasswordPage', signController.getForgetPasswordPage);
router.get('/user/login/getData/:email', signController.getUserData);
router.get('/user/signup', signController.getSignupPage);
router.post('/user/login/check', signController.checkLoginDetail);
router.get('/homepage' , signController.getLoginPage);
router.post('/user/signup/addUser', signController.addUser);

module.exports = router;