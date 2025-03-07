import { Schema, Document } from 'mongoose';

export const TransactionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  bookingDateTime: { type: Date },
  valueDateTime: { type: Date },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  transactionAmount: {
    amount: { type: Number },
    currency: { type: String },
  },
  reference: { type: String },
  description: { type: String },
  transactionInformation: [{ type: String }],
  isoBankTransactionCode: {
    domainCode: { code: { type: String }, name: { type: String } },
    familyCode: { code: { type: String }, name: { type: String } },
    subFamilyCode: { code: { type: String }, name: { type: String } },
  },
  proprietaryBankTransactionCode: {
    code: { type: String },
    issuer: { type: String },
  },
  balance: {
    type: { type: String },
    balanceAmount: {
      amount: { type: Number },
      currency: { type: String },
    },
  },
  payeeDetails: {
    name: { type: String },
    accountIdentifications: [
      {
        type: { type: String },
        identification: { type: String },
      },
    ],
  },
  payerDetails: {
    name: { type: String },
    accountIdentifications: [
      {
        type: { type: String },
        identification: { type: String },
      },
    ],
  },
  enrichment: {
    transactionHash: { hash: { type: String } },
  },
  accountId: { type: String, required: true },
});

export interface Transaction extends Document {
  id: string;
  date: Date;
  bookingDateTime: Date;
  valueDateTime: Date;
  status: string;
  amount: number;
  currency: string;
  transactionAmount: {
    amount: number;
    currency: string;
  };
  reference: string;
  description: string;
  transactionInformation: string[];
  isoBankTransactionCode: {
    domainCode: { code: string; name: string };
    familyCode: { code: string; name: string };
    subFamilyCode: { code: string; name: string };
  };
  proprietaryBankTransactionCode: {
    code: string;
    issuer: string;
  };
  balance: {
    type: string;
    balanceAmount: {
      amount: number;
      currency: string;
    };
  };
  payeeDetails: {
    name: string;
    accountIdentifications: { type: string; identification: string }[];
  };
  payerDetails: {
    name: string;
    accountIdentifications: { type: string; identification: string }[];
  };
  enrichment: {
    transactionHash: { hash: string };
  };
  accountId: string;
}
