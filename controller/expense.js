
const Expense = require('../model/data');
const User = require('../model/signup');
// const sequelize = require('../util/database');
const mongoose = require('mongoose');
require('dotenv').config()

//adding data to database
exports.postData = async (req, res, next) => {
    // const t = await sequelize.transaction();
    const session = await mongoose.startSession();
     session.startTransaction();
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const userId = req.user.id;
        const date = new Date();
        // const user = await User.findByPk(userId);
        // //updating total expense of user in database
        // const totalExpense = await user.update({ totalExpense: user.dataValues.totalExpense + +amount }, { transaction: t });
        // const datas = await Expense.create({ amount: amount, description: description, category: category, userId: userId, date:date }, { transaction: t });
        const user = await User.findById(userId);
        console.log(user);
        //updating total expense of user in database
        const totalExpense = await User.findOneAndUpdate({"_id":userId},{ totalExpense: user.totalExpense + +amount }, { session });
        const data = {
             amount: amount, 
             description: description, 
             category: category, 
             userId: userId, 
             date:date
        }
        console.log(data);
        const datas = await Expense.create([data], { session });
        const p = await session.commitTransaction();
        res.status(201).json({ datas: datas, totalExpense: totalExpense });
    }
    catch (err) {
        await session.endSession();
        console.log('error in adding data to db from controller');
        console.log(err);
        res.status(500).json({ error: err });
    }
}


//delete specific data from database
exports.postDelete = async (req, res, next) => {
    const session = await mongoose.startSession();
     session.startTransaction();
    try {
        const productid = req.body._id;
        const userid = req.user.id;
        // const deldata = await Expense.findAll({ where: { id: productid, userId: userid } });
        // const totalExpense = await user.update({ totalExpense: user.dataValues.totalExpense - +deldata[0].amount }, { transaction: t })
        // const data = await deldata[0].destroy({ transaction: t });
        // const deldata = await Expense.find({  id: productid, userId: userid});
        const totalExpense = await User.findOneAndUpdate({'_id':userid},{ totalExpense: req.user.totalExpense - +req.body.amount }, { session })
        const data = await Expense.deleteOne({_id: productid, userId: userid},{ session});

        const p = await session.commitTransaction();
        res.status(201).json({ data: data, totalExpense: totalExpense });
    }
    catch (err) {
        await session.endSession();
        console.log('error in deleting in db from controller');
        console.log(err);
        res.status(500).json({ error: err });
    }
}


//checking if user is premium or not
exports.checkPremiumUser = async (req, res, next) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid);
        res.status(201).json({ flag: user.isPremiumUser, name: user.name })
    }
    catch (err) {
        console.log(err);
    }
}


//get expense of specific user
exports.getExpenses = async(req,res,next) => {
    try{
        const expensePerPage = req.body.expensePerPage || 5;
        const page = +req.query.page || 1;
        const user = req.user;
        // const count=await Expense.count({where: { userId: req.user.id }});
        // const datas = await user.getExpenses({offset:(page-1)*expensePerPage, limit:+expensePerPage});
        const count=await Expense.countDocuments({userId: {$eq: req.user.id }});
        const datas = await Expense.find({userId:req.user.id}).skip((page-1)*expensePerPage).limit(+expensePerPage)
        res.status(201).json({datas:datas, currentPage:page, hasNextPage:expensePerPage*page<count,nextPage:page+1, hasPreviousPage:page>1, previousPage:page-1, lastPage: Math.ceil(count/expensePerPage)});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err, reqBody:req.body.expensePerPage});
    }
}


