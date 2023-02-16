import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InternetController } from './internet.controller';
import { InternetService } from './internet.service';

@Module({
  imports: [HttpModule],
  controllers: [InternetController],
  providers: [InternetService]
})
export class InternetModule {}
