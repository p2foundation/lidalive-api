import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BillpaymentsController } from './billpayments.controller';
import { BillpaymentsService } from './billpayments.service';

@Module({
  imports: [HttpModule],
  providers: [BillpaymentsService],
  controllers: [BillpaymentsController],
})
export class BillpaymentsModule {}
