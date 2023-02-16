import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import * as https from 'https';
import {
  ONE4ALL_APIKEY,
  ONE4ALL_APISECRET,
  ONE4ALL_BASEURL,
  ONE4ALL_RETAILER,
} from 'src/constants';
import { TransStatusDto } from './dto/transtatus.dto';
import { TopupDto } from './dto/topup.dto';
import { generateTransactionId } from 'src/utilities/utils';
import { TransactionsRepository } from 'src/transactions/transactions.repository';
import { TransactionDto } from 'src/transactions/dto/transaction.dto';

@Injectable()
export class AirtimeService {
  private logger = new Logger('AirtimeService');
  private AirBaseUrl = ONE4ALL_BASEURL;

  constructor(
    private readonly httpService: HttpService,
    private readonly transactionRepo: TransactionsRepository,
  ) {}

  transactionStatus(
    transDto: TransStatusDto,
  ): Observable<AxiosResponse<TransStatusDto>> {
    const { transReference } = transDto;

    const payload = {
      trnx: transReference || '',
    };

    // https://tppgh.myone4all.com/api/TopUpApi/transactionStatus?trnx=1KNRUW111021

    const tsUrl =
      this.AirBaseUrl + `/TopUpApi/transactionStatus?trnx=${payload.trnx}`;

    const configs = {
      url: tsUrl,
      headers: { ApiKey: ONE4ALL_APIKEY, ApiSecret: ONE4ALL_APISECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`transaction status payload == ${JSON.stringify(configs)}`);

    return this.httpService
      .get(configs.url, { httpsAgent: configs.agent, headers: configs.headers })
      .pipe(
        map((tsRes) => {
          this.logger.log(
            `Query TRANSACTION STATUS response ++++ ${JSON.stringify(tsRes.data)}`,
          );
          return tsRes.data;
        }),
        catchError((tsError) => {
          this.logger.error(
            `Query TRANSACTION STATUS ERROR response ---- ${JSON.stringify(
              tsError.response.data,
            )}`,
          );
          const tsErrorMessage = tsError.response.data;
          throw new NotFoundException(tsErrorMessage);
        }),
      );
  }

  topupAirtimeService(transDto: TopupDto): Observable<AxiosResponse<TopupDto>> {
    const { retailer, recipientNumber, amount, network, userId, merchantId } =
      transDto;

    // const clientReference = generateTransactionId();
    const taParams = {
      userId: userId,
      merchantId: merchantId,
      transType: 'AIRTIME TOPUP',
      retailer: ONE4ALL_RETAILER || retailer,
      network: 0 || network,
      recipient: recipientNumber || '',
      amount: amount || '',
      trxn: generateTransactionId() || '',
      originalAmount: '',
      fee: 0,
      recipientNumber: recipientNumber || '',
      serviceCode: '',
      transMessage: '',
      serviceTransId: '',
      transStatus: '',
      commentary: '',
      balance_before: '',
      balance_after: '',
      currentBalance: '',
    };

    // https://tppgh.myone4all.com/api/TopUpApi/airtime?retailer=233241603241&recipient=233244588584&amount=1&network=0&trxn=1234567890
    this.logger.log(`AIRTIME TOPUP params == ${JSON.stringify(taParams)}`);

    const taUrl = `/TopUpApi/airtime?retailer=${taParams.retailer}&recipient=${taParams.recipient}&amount=${taParams.amount}&network=${taParams.network}&trxn=${taParams.trxn}`;

    const configs: any = {
      url: this.AirBaseUrl + taUrl,
      headers: { ApiKey: ONE4ALL_APIKEY, ApiSecret: ONE4ALL_APISECRET },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.logger.log(`Airtime topup payload == ${JSON.stringify(configs)}`);

    return this.httpService
      .get<any>(configs.url, {
        httpsAgent: configs.agent,
        headers: configs.headers,
      })
      .pipe(
        map((taRes) => {
          this.logger.verbose(
            `AIRTIME TOPUP response ++++ ${JSON.stringify(taRes.data)}`,
          );

          if (taRes.data.status_code === '02') {
            this.logger.warn(`insufficient balance`);
            taParams.serviceCode = '';
            taParams.transMessage = '';
            taParams.serviceTransId = '';
            taParams.transStatus = '';
            taParams.commentary = '';
          } else if (taRes.data.status_code === '09') {
            this.logger.warn(`recharge requested but awaiting status`);
            taParams.serviceCode = '';
            taParams.transMessage = '';
            taParams.serviceTransId = '';
            taParams.transStatus = '';
            taParams.commentary = '';
          } else if (taRes.data.status_code === '06') {
            this.logger.log(`other error message`);
            taParams.serviceCode = '';
            taParams.transMessage = '';
            taParams.serviceTransId = '';
            taParams.transStatus = '';
            taParams.commentary = '';
          } else if (taRes.data.status_code === '00') {
            this.logger.verbose(`airtime topup successful`);
            taParams.serviceCode = taRes.data['status-code'];
            taParams.transMessage = taRes.data.message;
            taParams.serviceTransId = taRes.data.trxn;
            taParams.transStatus = taRes.data.status;
            taParams.balance_before = taRes.data.balance_before;
            taParams.balance_after = taRes.data.balance_after;

            taParams.commentary = `Airtime top-up for ${recipientNumber} successful`;

            // this.transactionRepo.saveTransaction(taParams.userId, taParams.merchantId,taParams );
          }
          return taRes.data;
        }),
        catchError((taError) => {
          this.logger.error(
            `AIRTIME TOP-UP ERROR response --- ${JSON.stringify(
              taError.response.data,
            )}`,
          );

          const taErrorMessage = taError.response.data;
          throw new NotFoundException(taErrorMessage);
        }),
      );
  }
}
