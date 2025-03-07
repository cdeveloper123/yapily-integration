import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { YapilyService } from '../yapily/yapily.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly yapilyService: YapilyService,
  ) {}

  @Post('fetch')
  async fetchTransactions(
    @Headers('consent-token') consentToken: string,
    @Body('accountId') accountId: string,
  ) {
    try {
      return await this.transactionsService.fetchAndStoreTransactions(
        consentToken,
        accountId,
      );
    } catch (error) {
      const [, message, status] =
        /message:\s*([^,]+).*status:\s*(\d+)/.exec(error) || [];
      throw new HttpException(
        {
          statusCode: +status,
          message,
        },
        +status,
      );
    }
  }

  @Get(':id')
  async listTransactions(@Param('id') accountId: string) {
    const transactions =
      await this.transactionsService.getTransactionsByAccountId(accountId);
    return { transactions };
  }
}
