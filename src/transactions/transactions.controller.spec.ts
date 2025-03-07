import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { YapilyService } from '../yapily/yapily.service';

const mockTransactionsService = {
  fetchAndStoreTransactions: jest.fn(),
  getAccounts: jest.fn(),
  getTransactionsByAccountId: jest.fn(),
};

const mockYapilyService = {};

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
        { provide: YapilyService, useValue: mockYapilyService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call fetchTransactions and return success message', async () => {
    mockTransactionsService.fetchAndStoreTransactions.mockResolvedValue({
      message: 'Transactions fetched and stored successfully',
    });

    const result = await controller.fetchTransactions(
      'sample-consent-token',
      'sample-account-id',
    );

    expect(result).toEqual({
      message: 'Transactions fetched and stored successfully',
    });
    expect(
      mockTransactionsService.fetchAndStoreTransactions,
    ).toHaveBeenCalledWith('sample-consent-token', 'sample-account-id');
  });

  it('should call listTransactions and return transactions for the account', async () => {
    mockTransactionsService.getTransactionsByAccountId.mockResolvedValue([
      { id: '1', description: 'Transaction 1' },
    ]);

    const result = await controller.listTransactions('sample-account-id');

    expect(result).toEqual({
      transactions: [{ id: '1', description: 'Transaction 1' }],
    });
    expect(
      mockTransactionsService.getTransactionsByAccountId,
    ).toHaveBeenCalledWith('sample-account-id');
  });
});
