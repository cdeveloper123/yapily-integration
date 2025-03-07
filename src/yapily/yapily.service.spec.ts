import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { YapilyService } from './yapily.service';
import {
  YapilyAccount,
  YapilyAccountAuthRequestResponse,
  YapilyTransaction,
} from './interfaces/yapily-responses.interface';

describe('YapilyService', () => {
  let service: YapilyService;
  let axiosMock: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YapilyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'YAPILY_BASE_URL':
                  return 'https://api.yapily.com';
                case 'YAPILY_APP_UUID':
                  return 'test-app-uuid';
                case 'YAPILY_SECRET':
                  return 'test-secret';
                case 'REDIRECT_URL':
                  return 'https://example.com/callback';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<YapilyService>(YapilyService);
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  describe('createAccountAuthRequest', () => {
    it('should return authorisation URL and account ID on success', async () => {
      const mockResponse: YapilyAccountAuthRequestResponse = {
        data: {
          authorisationUrl: 'https://auth.yapily.com',
        },
      };

      axiosMock
        .onPost(`${service['baseUrl']}/account-auth-requests`)
        .reply(200, mockResponse);

      const result = await service.createAccountAuthRequest(
        'test-user-id',
        'test-institution-id',
      );

      expect(result).toEqual({
        authorisationUrl: 'https://auth.yapily.com',
      });
    });

    it('should return error message on failure', async () => {
      axiosMock
        .onPost(`${service['baseUrl']}/account-auth-requests`)
        .reply(400);

      const result = await service.createAccountAuthRequest(
        'test-user-id',
        'test-institution-id',
      );

      expect(result).toEqual({
        message: 'Please Use Valid Institution ID',
      });
    });
  });

  describe('getAccounts', () => {
    it('should return accounts on success', async () => {
      const mockAccounts: YapilyAccount[] = [
        {
          id: 'account-1',
          balance: 1000,
          type: '',
          currency: '',
          usageType: '',
          accountType: '',
          accountNames: [],
          accountIdentifications: [],
          accountBalances: [],
        },
        {
          id: 'account-2',
          balance: 2000,
          type: '',
          currency: '',
          usageType: '',
          accountType: '',
          accountNames: [],
          accountIdentifications: [],
          accountBalances: [],
        },
      ];

      axiosMock
        .onGet(`${service['baseUrl']}/accounts`)
        .reply(200, mockAccounts);

      const result = await service.getAccounts('test-consent-token');

      expect(result).toEqual(mockAccounts);
    });

    it('should return error message on failure', async () => {
      axiosMock.onGet(`${service['baseUrl']}/accounts`).reply(500);

      const result = await service.getAccounts('test-consent-token');

      expect(result).toEqual({
        message: 'Request failed with status code 500',
        status: 500,
      });
    });
  });

  describe('getTransactions', () => {
    it('should return transactions on success', async () => {
      const mockTransactions: YapilyTransaction[] = [
        {
          id: 'txn-1',
          amount: 100,
          date: '',
          bookingDateTime: '',
          valueDateTime: '',
          status: '',
          currency: '',
          transactionAmount: {
            amount: 0,
            currency: '',
          },
          reference: '',
          description: '',
          transactionInformation: [],
          isoBankTransactionCode: {
            code: '',
            subCode: '',
          },
          proprietaryBankTransactionCode: '',
          balance: {
            type: '',
            balanceAmount: {
              amount: 0,
              currency: '',
            },
          },
          payeeDetails: {
            name: '',
            accountIdentifications: [],
          },
          payerDetails: {
            name: '',
            accountIdentifications: [],
          },
          enrichment: {
            transactionHash: {
              hash: '',
            },
          },
        },
        {
          id: 'txn-2',
          amount: 200,
          date: '',
          bookingDateTime: '',
          valueDateTime: '',
          status: '',
          currency: '',
          transactionAmount: {
            amount: 0,
            currency: '',
          },
          reference: '',
          description: '',
          transactionInformation: [],
          isoBankTransactionCode: {
            code: '',
            subCode: '',
          },
          proprietaryBankTransactionCode: '',
          balance: {
            type: '',
            balanceAmount: {
              amount: 0,
              currency: '',
            },
          },
          payeeDetails: {
            name: '',
            accountIdentifications: [],
          },
          payerDetails: {
            name: '',
            accountIdentifications: [],
          },
          enrichment: {
            transactionHash: {
              hash: '',
            },
          },
        },
      ];

      axiosMock
        .onGet(`${service['baseUrl']}/accounts/test-account-id/transactions`)
        .reply(200, mockTransactions);

      const result = await service.getTransactions(
        'test-consent-token',
        'test-account-id',
      );

      expect(result).toEqual(mockTransactions);
    });

    it('should return error message when no transactions are found', async () => {
      axiosMock
        .onGet(`${service['baseUrl']}/accounts/test-account-id/transactions`)
        .reply(403);

      const result = await service.getTransactions(
        'test-consent-token',
        'test-account-id',
      );

      expect(result).toEqual({
        message: 'No transactions found for this user..',
        status: 403,
      });
    });

    it('should return error message when consent token is invalid', async () => {
      axiosMock
        .onGet(`${service['baseUrl']}/accounts/test-account-id/transactions`)
        .reply(401);

      const result = await service.getTransactions(
        'test-consent-token',
        'test-account-id',
      );

      expect(result).toEqual({
        message: 'Invalid Consent Token',
        status: 401,
      });
    });

    it('should return unexpected error message on other failures', async () => {
      axiosMock
        .onGet(`${service['baseUrl']}/accounts/test-account-id/transactions`)
        .reply(500, 'Internal Server Error');

      const result = await service.getTransactions(
        'test-consent-token',
        'test-account-id',
      );

      expect(result).toEqual({
        message: 'Unexpected error: Request failed with status code 500',
        status: 500,
      });
    });
  });
});
