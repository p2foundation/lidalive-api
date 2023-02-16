import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  imports: [HttpModule],
  controllers: [SmsController],
  providers: [SmsService]
})
export class SmsModule {}
