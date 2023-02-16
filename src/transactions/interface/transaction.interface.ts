import mongoose from 'mongoose';

export interface TransactionInterface extends mongoose.Document {
  userId?: string;
  merchantId?: string;
  clientId?: string;
  retailer?: any;
  clientSecret: string;
  customerMsisdn: string;
  senderMsisdn: string;
  channel: string;
  amount: any;
  primaryCallbackUrl: string;
  clientReference: string;
  description: string;
  merchantName: string;
  transType: string; // debit|credit wallet
  serviceName: string;
  customerName: string;
  customerEmail: string;
  recipientName: string;
  merchantReference: string; // CAF201908011405034771D
  transId: string;
  originalAmount: string;
  amountPaid: string;
  charge: string;
  network: string;
  mobileNumber: string;
  recipientNumber: string;
  senderNumber: string;
  product: string;
  transDescription: string;
  voucher: string;
  serviceStatus: string; // enum { 0, 1, 2, 500, 200, 404 }
  transMessage: string; // Transaction Successful|Failed|Completed
  serviceTransId: string; // 5F9MGT61D7K6
  transStatus: string; // enum { failed, success }
  paymentStatus: string; // enum { pending, complete }
  callbackReceipt: string; // callback forward to dafabet? success : pending
  commentary: string;
  callbackUrl: string;
  readonly price: string;
  recipient_number: string;
  sender?: string;
  award?: string;
  apikey: string;
  orderID: string;
  token?: string;
  notifyURL?: string;
  notificationFormat?: string;
  destinationAddress?: string;
  criteria?: string;
  Status?: string;
  Transactionid?: string;
  transactionid?: string;
  Message?: string;
  MerchantReference?: string;
  CallbackURL?: string;
  currentBalance: string;
  balanceBefore: number;
  balanceAfter: number;
  recipient: string;
  trxn: string;
  fee: any;
  serviceCode: string;
}
