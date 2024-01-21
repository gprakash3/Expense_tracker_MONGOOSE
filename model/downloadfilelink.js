const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const linkSchema = new Schema({
    link: {type:String, required:true},
    // date: {type:Date, required:true},
    userId:{type:Object, ref:'user'}
});

module.exports = mongoose.model('Link', linkSchema);


// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Link = sequelize.define('link', {
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     userId:{
//         type:Sequelize.INTEGER,
//         allowNull:false
//     },
//     link:{
//         type:Sequelize.STRING,
//         allowNull:false
//     }
// });

// module.exports = Link;