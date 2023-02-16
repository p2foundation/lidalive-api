import * as mongoose from 'mongoose';

export const MerchantsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  apiKey: String,
  clientName: String,
  clientSecret: String,
  ClientDescription: String,
  websiteUrl: String,
  email: String,
  mobile: String,
  address: String,
  isConfirmed: { type: Boolean, default: false },
  status: { type: String, default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
