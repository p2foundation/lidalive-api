import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ReceiveMoneyDto } from './dto/receive.money.dto';
import { SendMoneyDto } from './dto/send.money.dto';
import { MobilemoneyService } from './mobilemoney.service';

@Controller('api/mobilemoney')
export class MobilemoneyController {
  private logger = new Logger('MobilemoneyController');

  constructor(private mobilemoneyService: MobilemoneyService) {}

  @Post('send')
  public async creditWallet(@Body() transDto: SendMoneyDto) {
    const cw = await this.mobilemoneyService.sendMobileMoney(transDto);
    return cw;
  }

  @Post('receive')
  public async debitWallet(@Body() transDto: ReceiveMoneyDto): Promise<any> {
    const dw = await this.mobilemoneyService.receiveMobileMoney(transDto);
    return dw;
  }
}
