const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    paymentid:{type:String, required:true},
    orderid: {type:String, required:true},
    status:{type:String, required:true},
    // date: {type:Date, required:true},
    userId:{type:Object, ref:'user'}
});

module.exports = mongoose.model('Order', orderSchema);


// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         primaryKey:true,
//         allowNull:false
//     },
//     paymentid:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     orderid:Sequelize.STRING,
//     status:Sequelize.STRING
// });

// module.exports=Order;