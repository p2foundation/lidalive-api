import * as mongoose from 'mongoose';

export interface UserInterface extends mongoose.Document {
  userName?: string;
  firstName?: string;
  lastName?: string;
  otherName?: string;
  email?: string;
  mobile?: string;
  status?: string;
  readonly password?: string;
  role?: string;
  gravatar?: string;
  photo?: string;
}
