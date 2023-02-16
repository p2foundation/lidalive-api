import { Module } from '@nestjs/common';
import { PsmobilemoneyService } from './psmobilemoney.service';
import { PsmobilemoneyController } from './psmobilemoney.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PsmobilemoneyService],
  controllers: [PsmobilemoneyController]
})
export class PsmobilemoneyModule {}
