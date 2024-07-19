const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose=require('mongoose');

const morgan = require('morgan');
const cors = require('cors');
app.use(cors());

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'access.log'),
//     { flags: 'a' }
// );
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
//   );
// const csp = {
//     directives: {
//         defaultSrc: ["'self'"],
//         imgSrc: ["'self'", "https://checkout.razorpay.com", "https://api.razorpay.com"],
//         frameSrc: ["'self'", "https://checkout.razorpay.com", "https://api.razorpay.com", "https://lumberjack-cx.razorpay.com"],
//         connectSrc: ["'self'", "https://lumberjack-cx.razorpay.com"],
//         scriptSrc: ["'self'", "http://process.env.VARIABLE_IP:3000", "https://checkout.razorpay.com", "https://api.razorpay.com/", "https://api.razorpay.com/", "'nonce-2726c7f26c'"],
//     },
// };

// app.use(helmet({
//     contentSecurityPolicy: csp,
// }));
// app.use(morgan('combined', { stream: accessLogStream }));

require('dotenv').config()


app.set('view engine', 'ejs');
app.set('views', 'views');

const callRoute = require('./route/expense');
const signupRoute = require('./route/signup');
const purchaseRoute = require('./route/purchase');
const premiumRoute = require('./route/premium');
const forgetPasswordRoute = require('./route/passwordretrive');
const reportRoute = require('./route/reportgenerate');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(signupRoute);
app.use(callRoute);
app.use(purchaseRoute);
app.use(premiumRoute);
app.use(forgetPasswordRoute);
app.use(reportRoute);

app.use((req,res) => {
    res.sendFile(path.join(__dirname, `public/login.html`));
})

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Request);
// Request.belongsTo(User);

// User.hasMany(Link);
// Link.belongsTo(User);

mongoose.connect(process.env.MONGODB_CONNECT)
    .then(result =>{
        console.log('app connected');
        app.listen(3000)
    })
    .catch(err => console.log(err));
    