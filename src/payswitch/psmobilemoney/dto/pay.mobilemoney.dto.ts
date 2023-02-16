export class PayMobileMoneyDto {
    readonly merchantId?: string;
    readonly transId?: string;
    transType?: string;
    readonly serviceName: string;
    recipientName?: string;
    customerEmail: string;
    clientReference: string;
    customerMsisdn: string;
    token?: string;
    channel: string;
    amount: string;
    description: string;
    transStatus?: string;
    transMessage?: string;
    serviceStatus?: string;
    serviceTransId?: string;
    paymentStatus?: string;
    otherInfo?: string; 
    r_switch: any;
    processing_code: any;
    transaction_id: any;
    desc: any;
    merchant_id: any;
    subscriber_number: any;
}