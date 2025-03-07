import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Connection } from 'mongoose';
import { TransactionsModule } from './transactions/transactions.module';
import { YapilyModule } from './yapily/yapily.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection: Connection) => {
          connection.on('connected', () => {
            Logger.log('MongoDB connected successfully', 'Mongoose');
          });
          connection.on('error', (err) => {
            Logger.error(`MongoDB connection error: ${err}`, 'Mongoose');
          });
          connection.on('disconnected', () => {
            Logger.warn('MongoDB disconnected', 'Mongoose');
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    TransactionsModule,
    YapilyModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
