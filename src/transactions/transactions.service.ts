import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { YapilyService } from '../yapily/yapily.service';
import {
  YapilyTransaction,
  YapilyTransactionApiResponse,
} from 'src/yapily/interfaces/yapily-responses.interface';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    private readonly yapilyService: YapilyService,
  ) {}

  async fetchAndStoreTransactions(consentToken: string, accountId: string) {
    try {
      const response: YapilyTransactionApiResponse =
        await this.yapilyService.getTransactions(consentToken, accountId);

      if (
        response &&
        typeof response === 'object' &&
        !Array.isArray(response)
      ) {
        const { data, message } = response;

        if (message) {
          console.log(response);
          throw new Error(`message: ${message} status: ${response?.status}`);
        }

        if (data && Array.isArray(data)) {
          if (data.length === 0) {
            return { message: 'No transactions found for this user.' };
          }

          const transactions = data.map((transaction: YapilyTransaction) => ({
            id: transaction.id,
            date: transaction.date,
            bookingDateTime: transaction.bookingDateTime,
            valueDateTime: transaction.valueDateTime,
            status: transaction.status,
            amount: transaction.amount,
            currency: transaction.currency,
            transactionAmount: transaction.transactionAmount,
            reference: transaction.reference,
            description: transaction.description,
            transactionInformation: transaction.transactionInformation,
            isoBankTransactionCode: transaction.isoBankTransactionCode,
            proprietaryBankTransactionCode:
              transaction.proprietaryBankTransactionCode,
            balance: transaction.balance,
            payeeDetails: transaction.payeeDetails,
            payerDetails: transaction.payerDetails,
            enrichment: transaction.enrichment,
            accountId,
          }));

          for (const transaction of transactions) {
            await this.transactionModel.updateOne(
              { id: transaction.id },
              transaction,
              { upsert: true },
            );
          }
          return { message: 'Transactions fetched and stored successfully' };
        } else {
          throw new Error('Invalid response data format');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      throw new Error(`Error fetching and storing transactions: ${error}`);
    }
  }

  async createMany(transactions: any[]) {
    return this.transactionModel.insertMany(transactions);
  }

  async getTransactionsByAccountId(accountId: string) {
    const transactions = await this.transactionModel.find({ accountId }).exec();
    if (transactions.length === 0) {
      return { message: 'No transactions found for this account ID.' };
    }
    return transactions;
  }
}
