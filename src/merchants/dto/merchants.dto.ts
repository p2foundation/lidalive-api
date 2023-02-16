export class MerchantsDto {
  readonly userId: string;
  readonly apiKey: string;
  clientName: string;
  clientSecret: string;
  clientDescription: string;
  websiteUrl: string;
  email: string;
  mobile: string;
  address: string;
  isConfirmed: string;
  status: string;
  other?: string;
}
