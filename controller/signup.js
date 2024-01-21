const User = require('../model/signup');
const jwt=require('jsonwebtoken');

const path=require('path');
const rootDir = require('../util/path');
require('dotenv').config()
const bcrypt=require('bcrypt');

//redirecting user to forget password page
exports.getForgetPasswordPage = (req,res,next) => {
    res.sendFile(path.join(rootDir, 'views', 'forgetpassword.html'));
}

//redirect user to expense page
exports.getExpensePage = (req,res,next) => {
    res.sendFile(path.join(rootDir, 'views', 'expense.html'));
}

//redirect user to login page
exports.getLoginPage = (req,res,next) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
};

//redirect user to signup page
exports.getSignupPage = (req,res,next) => {
    res.sendFile(path.join(rootDir, 'views', 'signup.html'));
};

//add username, email and encrypted password to database
exports.addUser = async(req,res,next) => {
    try{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    console.log(name + " " +  email+ " " + password);

    //here 10 is saltround
    bcrypt.hash(password, 10, async(err,hash) => {
        console.log(err);
        const userdata = await User.create({name:name, email:email, password:hash});
        res.status(201).json({userdata:userdata});
    })
   

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err}); 
    }
}

//To check if user already exist during sign up
exports.getUserData = async(req,res,next) => {
    try{
    const email =  req.params.email;
    console.log(email);
    // const userData = await User.findAll({where:{email:email}});
    const userData= await User.find({'email':email})
    res.status(201).json({userdata:userData[0]});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err}); 
    }
}

//generate access key based on userId and username
// function generateAccessKey(id,name){
//     return jwt.sign({userId:id, name:name},'secretKey');  
// }
exports.checkLoginDetail = async(req,res,next) => {
    try{
        const email =  req.body.email;
        const password = req.body.password;
        // const userDatas = await User.findAll({where:{email:email}});
        const userDatas = await User.find({"email":email});
        const userData=userDatas[0];
        console.log(userData);
        if(!userData){
            res.status(404).json({userdata:'User Not found'});
        }
        else{
            bcrypt.compare(password, userData.password, (err,response) => {
                if(response ===true){
                    const x =jwt.sign({userId:userData.id, name:userData.name, isPremium:userData.isPremiumUser},'secretKey');
                    console.log(x);
                    
                    res.json({token:x})
                    
                   
                }
                else{
                    res.status(401).json({userdata:'User Not Authorized - Enter Correct Password'});
                }
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err}); 
    }
}