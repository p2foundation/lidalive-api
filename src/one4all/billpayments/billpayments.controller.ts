import { Body, Controller, Logger, Post } from '@nestjs/common';
import { BillpaymentsService } from './billpayments.service';
import { BillpaymentDto } from './dto/billpayments.dto';

@Controller('billpayments')
export class BillpaymentsController {
  private logger = new Logger('BillpaymentsController');

  constructor(private billpaymentService: BillpaymentsService) {}

  @Post('/internetdata')
  public async buyInternetData(@Body() bidDto: BillpaymentDto): Promise<any> {
    this.logger.log(`INTERNET DATA dto => ${JSON.stringify(bidDto)}`);
    const ts = await this.billpaymentService.topupInternetBundle(bidDto);
    return ts;
  }

  @Post('/bundlelist')
  public async listDataBundle(@Body() ldbDto: BillpaymentDto): Promise<any> {
    this.logger.log(`BUNDLE LIST dto => ${JSON.stringify(ldbDto)}`);
    const ta = await this.billpaymentService.dataBundleList(ldbDto);
    return ta;
  }
}
