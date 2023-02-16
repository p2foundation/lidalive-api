import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionInterface } from './interface/transaction.interface';

@Injectable()
export class TransactionsRepository {
  private logger = new Logger(TransactionsRepository.name);

  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<TransactionInterface>,
  ) {}

  public async findAllTransactions(): Promise<TransactionInterface[]> {
    const allTrans = await this.transactionModel.find().exec();
    return allTrans;
  }

  public async findTransById(transId: string): Promise<TransactionInterface> {
    const ftbi = await this.transactionModel.findById({ _id: transId }).exec();
    return ftbi;
  }

  public async saveTransaction(
    userId: string,
    merchantId: string,
    transData: any,
  ): Promise<TransactionInterface> {
    const payload: any = {
      clientId: transData.clientId,
      clientSecret: transData.clientSecret,
      retailer: transData.retailer,
      customerMsisdn: transData.customerMsisdn,
      channel: transData.channel,
      amount: transData.amount,
      primaryCallbackUrl: transData.primaryCallbackUrl,
      clientReference: transData.clientReference,
      description: transData.description,
      merchantName: transData.merchantName,
      transType: transData.transType,
      serviceName: transData.serviceName,
      customerName: transData.customerName,
      customerEmail: transData.customerEmail,
      merchantReference: transData.merchantReference,
      localTransId: transData.transId,
      originalAmount: transData.originalAmount,
      amountPaid: transData.amountPaid,
      charge: transData.charge,
      network: transData.network,
      recipientNumber: transData.recipientNumber,
      senderNumber: transData.senderNumber,
      product: transData.product,
      transDescription: transData.transDescription,
      vouche: transData.voucher || transData.token,
      serviceStatus: transData.serviceName,
      transMessage: transData.transMessage,
      serviceTransId: transData.serviceTransId,
      transStatus: transData.transStatus,
      paymentStatus: transData.paymentStatus,
      callbackReceipt: transData.callbackReceipt,
      commentary: transData.commentary,
      callbackUrl: transData.callbackUrl,
      price: transData.price,
      recipient_number: transData.recipient_number,
      sender: transData.sender,
      award: transData.award,
      orderID: transData.orderID,
      token: transData.token,
      currentBalance: transData.currentBalance,
      balanceAfter: transData.balanceAfter,
      balanceBefore: transData.balanceBefore,
    };

    const newTrans = new this.transactionModel(payload);
    try {
      await newTrans.save();
      this.logger.log('Transaction saved successfully');
    } catch (e) {
      this.logger.error(`ERROR SAVING TRANSACTION: ${JSON.stringify(e)}`);
    }
    return newTrans;
  }

  public async updateTransactionRecord(
    transId: string,
    changes: TransactionDto,
  ): Promise<TransactionInterface> {
    const utr = await this.transactionModel.findByIdAndUpdate(
      transId,
      changes,
      {
        new: true,
      },
    );
    return utr;
  }

  public async removeTransRecord(transId: string): Promise<any> {
    const rtr = await this.transactionModel.findByIdAndRemove(transId);
    return rtr;
  }
}
