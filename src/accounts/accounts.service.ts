import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './schemas/account.schema';
import { YapilyService } from '../yapily/yapily.service';
import {
  YapilyAccount,
  YapilyApiResponse,
} from 'src/yapily/interfaces/yapily-responses.interface';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private readonly yapilyService: YapilyService,
  ) {}

  async fetchAndStoreAccounts(
    consentToken: string,
  ): Promise<{ message: string }> {
    try {
      if (!consentToken) {
        throw new Error('Consent token is required');
      }

      const response = (await this.yapilyService.getAccounts(
        consentToken,
      )) as YapilyApiResponse;

      if ('data' in response && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          return {
            message: 'No accounts found for the provided consent token',
          };
        }

        const accounts: YapilyAccount[] = response.data.map((account) => ({
          id: account.id,
          type: account.type,
          balance: account.balance,
          currency: account.currency,
          usageType: account.usageType,
          accountType: account.accountType,
          accountNames: account.accountNames,
          accountIdentifications: account.accountIdentifications,
          accountBalances: account.accountBalances,
        }));

        for (const account of accounts) {
          await this.accountModel.updateOne({ id: account.id }, account, {
            upsert: true,
          });
        }

        return { message: 'Accounts fetched and stored successfully' };
      } else if ('message' in response) {
        // Handle error response
        console.log(response);
        throw new Error(
          `message: ${response.message} status: ${response?.status}`,
        );
      } else {
        throw new Error('Invalid response data format');
      }
    } catch (error) {
      throw new Error(`Error fetching and storing accounts: ${error}`);
    }
  }

  async getAccounts() {
    const accounts = await this.accountModel.find().exec();
    if (accounts.length === 0) {
      return { message: 'No accounts found. Please Update the DB.' };
    }
    return accounts;
  }
}
