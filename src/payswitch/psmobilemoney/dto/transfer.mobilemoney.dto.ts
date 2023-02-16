export class TransferMobileMoneyDto {
    readonly merchantId?: string;
    readonly transId?: string;
    readonly transType?: string;
    readonly serviceName: string;
    recipientName: string;
    customerEmail: string;
    clientReference: string;
    recipientMsisdn: string;
    channel: string;
    amount: string;
    description: string;
    transStatus?: string;
    transMessage?: string;
    serviceStatus?: string;
    serviceTransId?: string;
    paymentStatus?: string;
    otherInfo?: string;
}