import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  HttpException,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { YapilyService } from '../yapily/yapily.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly yapilyService: YapilyService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('initiate-auth')
  async initiateAuth(
    @Body('applicationUserId') applicationUserId: string,
    @Body('institutionId') institutionId: string,
  ) {
    return this.yapilyService.createAccountAuthRequest(
      applicationUserId,
      institutionId,
    );
  }

  @Post('fetch')
  async fetchAccounts(@Headers('consent-token') consentToken: string) {
    try {
      if (!consentToken) {
        throw new Error('Consent token is required');
      }
      return await this.accountsService.fetchAndStoreAccounts(consentToken);
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

  @Get()
  async listAccounts() {
    return this.accountsService.getAccounts();
  }
}
