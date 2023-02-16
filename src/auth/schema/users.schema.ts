import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  userName: String,
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  gravatar: String,
  role: {
    enum: ['GUEST', 'USER', 'ADMIN', 'DEVELOPER'],
    type: String,
    default: 'USER',
  },
  status: { type: String, default: 'ACTIVE' },
  password: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
