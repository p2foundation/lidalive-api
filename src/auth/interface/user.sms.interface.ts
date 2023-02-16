export interface UserSmsInterface {
  readonly transactionId?: string;
  readonly username: string;
  readonly password: string;
  destination: string;
  source: string;
  message?: string;
  url?: string;
}

export interface NpuntuStatusInterface {
  readonly transactionId?: string;
  readonly username: string;
  readonly password: string;
  number?: string;
  timestamp?: string;
}
