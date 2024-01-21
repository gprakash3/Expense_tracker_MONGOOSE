const express=require('express');
const router=express.Router();
const reportController = require('../controller/report');
const authController = require('../middleware/auth');

router.get('/getdailyreportpage', reportController.getdailyreportpage);
//to get expense report
router.get('/premium/dailyreport' ,authController.authenticate , reportController.getDailyReport);
router.get('/getweeklyreportpage', reportController.getWeeklyReportPage);
router.get('/getmonthlyreportpage', reportController.getmonthlyreportpage)
module.exports = router;