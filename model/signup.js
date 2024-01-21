const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password: {type:String, defalut:0},
    isPremiumUser: {type:Boolean},
    totalExpense:{type:Number, default:0}
});
module.exports = mongoose.model('User', userSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user' , {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     email:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         unique:true,
//     },
//     password:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     isPremiumUser:Sequelize.BOOLEAN,
//     totalExpense:{
//         type: Sequelize.INTEGER,
//         default:0
//     }


// });

// module.exports = User;