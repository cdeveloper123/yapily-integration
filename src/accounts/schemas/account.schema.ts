import { Schema, Document } from 'mongoose';

export const AccountSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, required: true },
  currency: { type: String, required: true },
  usageType: { type: String, required: true },
  accountType: { type: String, required: true },
  accountNames: [{ name: { type: String } }],
  accountIdentifications: [
    {
      type: { type: String },
      identification: { type: String },
    },
  ],
  accountBalances: [
    {
      type: { type: String },
      dateTime: { type: Date },
      balanceAmount: {
        amount: { type: Number },
        currency: { type: String },
      },
      creditLineIncluded: { type: Boolean },
      creditLines: [
        {
          type: { type: String },
          creditLineAmount: {
            amount: { type: Number },
            currency: { type: String },
          },
        },
      ],
    },
  ],
});

export interface Account extends Document {
  id: string;
  type: string;
  balance: number;
  currency: string;
  usageType: string;
  accountType: string;
  accountNames: { name: string }[];
  accountIdentifications: { type: string; identification: string }[];
  accountBalances: {
    type: string;
    dateTime: Date;
    balanceAmount: {
      amount: number;
      currency: string;
    };
    creditLineIncluded: boolean;
    creditLines: {
      type: string;
      creditLineAmount: {
        amount: number;
        currency: string;
      };
    }[];
  }[];
}
