const Razorpay = require('razorpay');
const Order = require('../model/order');
const User=require('../model/signup');
require('dotenv').config()


//create new payment and update status to pending in database.
exports.purchasePremium = async (req, res, next) => {
    try {
        const RAZORPAY_KEY = process.env.RAZORPAY_KEY_ID;
        const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;
        var rzp = new Razorpay({
            key_id: RAZORPAY_KEY,
            key_secret: RAZORPAY_SECRET
        })
        const amount = 500;

        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            }
            // req.user.createOrder({ orderid: order.id, paymentid: 'Pending', status: 'PENDING' }).then(() => {
                Order.create({ orderid: order.id, paymentid: 'Pending', status: 'PENDING', userId:req.user }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            })
                .catch(err => {
                    throw new Error(err);
                })
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: 'something went wrong', error: err });
    }
}


//update user status to premium upon sucessful payment
exports.updatetransactionstatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        console.log('updatetransaction request body', req.body);

        // const order = await Order.findOne({ where: { orderid: order_id } })
        // const promise = await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        // const promise2 = await req.user.update({ isPremiumUser: true });

        const order = await Order.findOneAndUpdate({orderid:order_id}, { paymentid: payment_id, status: 'SUCCESSFUL' });
        const promise = await User.findOneAndUpdate({_id: req.user.id},{ isPremiumUser: true });
        Promise.all([order, promise]).then(() => {
            return res.status(202).json({ success: true, message: 'Transaction successful' });
        });
    }
    catch (err) {

        console.log(err);
        res.status(403).json({ error: err, message: 'something went wrong' });
    }
}


//when payment failed then update payment status to failed
exports.updatefailed = async (req, res, next) => {
    try {
        const order_id = req.body.order_id;

        // const order = await Order.findOne({ where: { orderid: order_id } })
        // const promise = await order.update({ paymentid: 'Failed payment', status: 'Failed' });
        // const promise2 = await req.user.update({ isPremiumUser: false });
        const order = await Order.findOneAndUpdate({ orderid: order_id},{ paymentid: 'Failed payment', status: 'Failed' } )
        const promise2 =  User.findOneAndUpdate({_id: req.user.id},{ isPremiumUser: false });
        Promise.all([promise, promise2]).then(() => {
            return res.status(500).json({ success: true, message: 'Transaction Failed' });
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'something went wrong' });
    }
}