// const { v4: uuidv4 } = require('uuid');

const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const requestlinkSchema = new Schema({
    uuid:{type:String, required:true},
    isactive: {type:Boolean, required:true},
    userId:{type:Object, ref:'user'}
});

module.exports = mongoose.model('RequestLink', requestlinkSchema);



// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Request = sequelize.define('request', {

//     id:{
//         // var uuid = nodeUuid.v4();
//         type:Sequelize.UUID,
//         primaryKey:true
//     },
//     userId:{
//         type:Sequelize.INTEGER,
//         allowNull:false
//     },
//     isactive:Sequelize.BOOLEAN

// });

// module.exports = Request;