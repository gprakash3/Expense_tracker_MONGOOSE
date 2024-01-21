const express=require('express');
const router=express.Router();

const purchaseController = require('../controller/purchase');
const authController = require('../middleware/auth');

router.get('/purchase/premiummembership',authController.authenticate, purchaseController.purchasePremium);
router.post('/purchase/updatetransactionstatus', authController.authenticate, purchaseController.updatetransactionstatus);
router.post('/purchase/updatetxnfailed', authController.authenticate, purchaseController.updatefailed);
module.exports = router;