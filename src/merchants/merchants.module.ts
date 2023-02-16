import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantsSchema } from './schema/merchants.schema';
import { CryptoService } from 'src/utilities/crypto.service';
import { DefaultUtilityService } from 'src/utilities/default.utility.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Merchants', schema: MerchantsSchema }]),
  ],
  providers: [
    MerchantsService, 
    CryptoService, 
    DefaultUtilityService],
  controllers: [MerchantsController],
})
export class MerchantsModule {}
