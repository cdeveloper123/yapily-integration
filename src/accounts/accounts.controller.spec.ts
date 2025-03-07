import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { YapilyService } from '../yapily/yapily.service';

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountsService: AccountsService;
  let yapilyService: YapilyService;

  // Mocking the AccountsService and YapilyService
  const mockAccountsService = {
    fetchAndStoreAccounts: jest.fn(),
    getAccounts: jest.fn(),
  };

  const mockYapilyService = {
    createAccountAuthRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
        {
          provide: YapilyService,
          useValue: mockYapilyService,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
    yapilyService = module.get<YapilyService>(YapilyService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /accounts/initiate-auth', () => {
    it('should call createAccountAuthRequest method of YapilyService', async () => {
      const applicationUserId = 'user1';
      const institutionId = 'inst1';

      mockYapilyService.createAccountAuthRequest.mockResolvedValue(
        'auth-request-id',
      );

      const result = await controller.initiateAuth(
        applicationUserId,
        institutionId,
      );

      expect(result).toBe('auth-request-id');
      expect(mockYapilyService.createAccountAuthRequest).toHaveBeenCalledWith(
        applicationUserId,
        institutionId,
      );
    });
  });

  describe('POST /accounts/fetch', () => {
    it('should throw an error if no consent token is provided', async () => {
      // We should pass an empty string, not null, to match the expected type
      await expect(controller.fetchAccounts('')).rejects.toThrowError(
        'Http Exception',
      );
    });

    it('should call fetchAndStoreAccounts method of AccountsService with consent token', async () => {
      const consentToken = 'some-consent-token';
      mockAccountsService.fetchAndStoreAccounts.mockResolvedValue(
        'accounts-data',
      );

      const result = await controller.fetchAccounts(consentToken);

      expect(result).toBe('accounts-data');
      expect(mockAccountsService.fetchAndStoreAccounts).toHaveBeenCalledWith(
        consentToken,
      );
    });
  });

  describe('GET /accounts', () => {
    it('should return a list of accounts', async () => {
      mockAccountsService.getAccounts.mockResolvedValue([
        { id: 1, name: 'Account 1' },
      ]);

      const result = await controller.listAccounts();

      expect(result).toEqual([{ id: 1, name: 'Account 1' }]);
      expect(mockAccountsService.getAccounts).toHaveBeenCalled();
    });
  });
});
