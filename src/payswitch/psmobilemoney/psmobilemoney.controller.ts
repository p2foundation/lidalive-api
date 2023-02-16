import { Controller, Res, Query, Get, Post, Body, HttpStatus, Logger } from '@nestjs/common';
import { PsmobilemoneyService } from './psmobilemoney.service';
import { Response } from 'express'
import { TransferMobileMoneyDto } from './dto/transfer.mobilemoney.dto';
import { PayMobileMoneyDto } from './dto/pay.mobilemoney.dto';

@Controller('api/psmobilemoney')
export class PsmobilemoneyController {
    private logger = new Logger(PsmobilemoneyController.name);
    constructor(
        private psMobilemoneyService: PsmobilemoneyService
    ) { }

    // @Get('gtcallback')
    // async receiveWalletCallback(
    //     @Res() res: Response,
    //     @Query() qr: CallbackWalletDto,
    // ) {
    //     const wc = await qr;
    //     this.logger.log(`query Telco push response ??? ${JSON.stringify(wc)}`);
    //     res.status(HttpStatus.CREATED).send(wc);
    // }

    @Post('transfermoney')
    public async creditWallet(
        @Body() transDto: TransferMobileMoneyDto,
    ) {
        const cw = await this.psMobilemoneyService.transferMobilemoney(transDto);
        return cw;
    }

    @Post('debitwallet')
    public async debitWallet(
        @Body() transDto: PayMobileMoneyDto,
    ) {
        console.log(`${transDto}`)
        const dw = await this.psMobilemoneyService.mobileMoneyPayment(transDto);
        this.logger.debug(`db money init response ===> ${JSON.stringify(dw)}`);
        return dw;
    }

    //   @Post('testPost')
    //   async testPost(
    //     @Body() transDto: CallbackWalletDto,
    //   ) {
    //     const dw = await this.transactionService.walletCallback(transDto);
    //     return dw;
    //   }

    //   @Post('mostatus')
    //   async transStatus(
    //     @Body() transDto: TransStatusDto,
    //   ) {
    //     const ts = await this.transactionService.checkTransStatus(transDto);
    //     return ts;
    //   }

}
