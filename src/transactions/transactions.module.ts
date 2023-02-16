import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DefaultUtilityService } from 'src/utilities/default.utility.service';
import { TransactionSchema } from './scheme/transaction.schema';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ],
  providers: [
    TransactionsService,
    TransactionsRepository,
    DefaultUtilityService,
  ],
  exports: [TransactionsModule]
})
export class TransactionsModule {}
