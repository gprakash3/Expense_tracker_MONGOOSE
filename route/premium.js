const express=require('express');
const router=express.Router();

const premiumController = require('../controller/premium');
const authController = require('../middleware/auth');


router.get('/premium/leaderboard', premiumController.getleaderboarddata);
// router.get('/premium/dailyreport' ,authController.authenticate , premiumController.getDailyReport);
router.get('/download', authController.authenticate , premiumController.downloadExpense);
router.get('/getFileLinks', authController.authenticate, premiumController.getDownloadFileLinks);
router.post('/postLink', authController.authenticate, premiumController.postLinkToTable);

module.exports = router;