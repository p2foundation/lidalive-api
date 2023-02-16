import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
import { SmsDto } from './dto/sms.dto';
import { SmsService } from './sms.service';

// @ApiTags('sms')
@Controller('api/sms')
export class SmsController {
    private logger = new Logger(SmsController.name);

    constructor(
        private smsService: SmsService,
    ) { }

    @Post('sendsms')
    public async sendSms(
        @Body() transDto: SmsDto
    ) {
        const s2 = await this.smsService.SendSMS(transDto);
        return s2;
    }

    @Post('bulk')
    public async sendBulkSms(
        @Body() transDto: SmsDto
    ): Promise<any> {
        const sbs = await this.smsService.postBulkSMS(transDto);
        return sbs;
    }

}
