import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MerchantsInterface } from './interface/merchants.interface';
import { Response } from 'express';
import { MerchantsService } from './merchants.service';
import { User } from '../security/user.decorator';
import { SecurityInterface } from '../security/interface/security.interface';
import { AuthenticationGuard } from '../guards/authentication.guard';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('merchants')
@Controller('api/')
@UseGuards(AuthenticationGuard)
export class MerchantsController {
  private logger = new Logger('MerchantsController');

  constructor(private merchantsService: MerchantsService) {}

  @Get('merchants')
  public async findAllRegisteredMerchants(@Res() res: Response): Promise<any> {
    const farm = await this.merchantsService.getRegisteredMerchants();
    res.status(HttpStatus.OK).json(farm);
  }

  @Post('merchant')
  public async saveNewMerchant(
    @Res() res: Response,
    @User() userId: SecurityInterface,
    @Body() merchantData: MerchantsInterface,
  ): Promise<any> {
    const snm = await this.merchantsService.registerNewMerchant(
      userId,
      merchantData,
    );
    res.status(HttpStatus.CREATED).json(snm);
  }

  @Put('merchant/update/:merchantId')
  public async updateMerchantRecord(
    @Res() res: Response,
    @Param('merchantId') merchantId: string,
    @Body() changes: MerchantsInterface,
  ): Promise<any> {
    this.logger.log(`update merchant: ${JSON.stringify(changes)}`);
    const umr = await this.merchantsService.updateMerchantRecord(
      merchantId,
      changes,
    );
    res.status(HttpStatus.CREATED).json(umr);
  }
  @Delete('merchant/delete/:merchantId')
  public async removeMerchant(
    @Res() res: Response,
    @Param('merchantId') merchantId: string,
  ): Promise<any> {
    const rm = await this.merchantsService.deleteMerchantAccount(merchantId);
    res.status(HttpStatus.CREATED).json(rm);
  }


}
