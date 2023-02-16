import * as mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchants' },
  merchantName: String,
  transType: String, // airtime|internet|mobile money|credit card|Bank direct
  serviceName: String, // debit|credit|reverse wallet
  customerName: String,
  customerEmail: String,
  MerchantReference: String,
  retailer: String,
  localTransId: String,
  originalAmount: String,
  amountPaid: String,
  charge: String,
  network: String,
  recipientNumber: String,
  senderNumber: String,
  transDescription: String,
  voucher: String,
  serviceCode: String, // enum { 0, 1, 2, 500, 200, 404 }
  transMessage: String, // Transaction Successful|Failed|Completed
  serviceTransId: String, // 5F9MGT61D7K6
  transStatus: String, // enum { failed, success }
  paymentStatus: String, // enum { pending, complete }
  callbackUrl: String,
  callbackReceipt: String, // callback forward to dafabet? success : pending
  currentBalance: String,
  balanceBefore: String,
  balanceAfter: String,
  award: String,
  commentary: String,
});
