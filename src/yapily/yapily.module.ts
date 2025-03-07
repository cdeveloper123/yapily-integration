import { Module } from '@nestjs/common';
import { YapilyService } from './yapily.service';

@Module({
  providers: [YapilyService],
  exports: [YapilyService],
})
export class YapilyModule {}
