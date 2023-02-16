import * as mongoose from 'mongoose';

export interface SecurityInterface extends mongoose.Document {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gravatar?: string;
  photo?: string;
  role?: string;
  status: string;
  password?: string;
}
