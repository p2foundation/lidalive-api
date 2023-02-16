export class BillpaymentDto {
  readonly retailer: string;
  recipientNumber: string;
  dataCode?: string;
  network: number;
  transId: string;
}
