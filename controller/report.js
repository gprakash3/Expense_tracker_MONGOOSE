const User = require('../model/signup');
const Expense=require('../model/data');
const path=require('path');
const rootDir = require('../util/path');
const sequelize = require('../util/database');
require('dotenv').config()

//view dailyreport page
exports.getdailyreportpage = (req,res,next) => {
    res.sendFile(path.join(rootDir, 'views', 'dailyreport.html'));
}

//view weekly report page
exports.getWeeklyReportPage = (req,res,next) => {
    res.sendFile(path.join(rootDir, 'views', 'weeklyreport.html'));
}

//view monthly report page
exports.getmonthlyreportpage = (req,res,next) => {
    res.sendFile(path.join(rootDir, 'views', 'monthlyreport.html'));
}

//get dailyreport according to creation date
exports.getDailyReport = async(req,res,next) => {
    try{
     const user = req.user;
     console.log('this is the user',user)
    //  const expenses = await user.getExpenses({
    //    attributes: ['amount', 'category', 'description','date'],
    //    order:[[sequelize.col('createdAt')]]
    //  });
    const expenses = await Expense.find({userId:req.user.id}).select(['amount', 'description', 'category', 'date']).sort({date:1});
     res.json({datas:expenses});
   }
   catch(err){
     console.log(err);
     res.json({error:err});
   }
   
    }

