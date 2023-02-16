import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MONGODB_URI } from './constants';
import { MerchantsController } from './merchants/merchants.controller';
import { MerchantsModule } from './merchants/merchants.module';
import { GetUserMiddleware } from './middleware/getuser.middleware';
import { AirtimeModule } from './one4all/airtime/airtime.module';
import { InternetModule } from './one4all/internet/internet.module';
import { MobilemoneyModule } from './one4all/mobilemoney/mobilemoney.module';
import { SmsModule } from './one4all/sms/sms.module';
import { PscardpaymentModule } from './payswitch/pscardpayment/pscardpayment.module';
import { PsmobilemoneyModule } from './payswitch/psmobilemoney/psmobilemoney.module';
import { SecurityModule } from './security/security.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    AuthModule,
    SecurityModule,
    MongooseModule.forRoot(process.env.MONGODB_URI || MONGODB_URI),
    MerchantsModule,
    AirtimeModule,
    InternetModule,
    MobilemoneyModule,
    SmsModule,
    PscardpaymentModule,
    PsmobilemoneyModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppService,
    },
    {
      provide: 'APP_NAME',
      useValue: 'LidaPay BACKEND',
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserMiddleware).forRoutes(MerchantsController);
  }
}
