import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import {
  YapilyAccount,
  YapilyAccountAuthRequestResponse,
  YapilyErrorResponse,
  YapilyTransaction,
} from './interfaces/yapily-responses.interface';

@Injectable()
export class YapilyService {
  private readonly baseUrl: string;
  private readonly headers: { [key: string]: string };

  constructor(private readonly configService: ConfigService) {
    const baseUrl = this.configService.get<string>('YAPILY_BASE_URL');
    if (!baseUrl) {
      throw new Error('YAPILY_BASE_URL environment variable is not defined');
    }
    this.baseUrl = baseUrl;
    const authString = Buffer.from(
      `${this.configService.get<string>('YAPILY_APP_UUID', '')}:${this.configService.get<string>('YAPILY_SECRET', '')}`,
    ).toString('base64');
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authString}`,
    };
  }

  async createAccountAuthRequest(
    applicationUserId: string,
    institutionId: string,
  ): Promise<{ authorisationUrl: string } | YapilyErrorResponse> {
    try {
      const requestBody = {
        applicationUserId,
        institutionId,
        callback: this.configService.get<string>('REDIRECT_URL'),
      };

      const response = await axios.post<YapilyAccountAuthRequestResponse>(
        `${this.baseUrl}/account-auth-requests`,
        requestBody,
        {
          headers: this.headers,
        },
      );

      return {
        authorisationUrl: response.data.data.authorisationUrl,
      };
    } catch {
      return {
        message: 'Please Use Valid Institution ID',
      };
    }
  }

  async getAccounts(
    consentToken: string,
  ): Promise<YapilyAccount[] | YapilyErrorResponse> {
    try {
      const response = await axios.get<YapilyAccount[]>(
        `${this.baseUrl}/accounts`,
        {
          headers: { ...this.headers, Consent: consentToken },
        },
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        message: axiosError.message,
        status: axiosError.status,
      };
    }
  }

  async getTransactions(
    consentToken: string,
    accountId: string,
  ): Promise<YapilyTransaction[] | YapilyErrorResponse> {
    try {
      const response = await axios.get<YapilyTransaction[]>(
        `${this.baseUrl}/accounts/${accountId}/transactions`,
        {
          headers: { ...this.headers, Consent: consentToken },
        },
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.status === 403) {
        return {
          message: 'No transactions found for this user..',
          status: 403,
        };
      } else if (axiosError.status === 401) {
        return {
          message: 'Invalid Consent Token',
          status: 401,
        };
      } else {
        return {
          message: `Unexpected error: ${axiosError.message}`,
          status: 500,
        };
      }
    }
  }
}
