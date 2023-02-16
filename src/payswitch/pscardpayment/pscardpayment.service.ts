import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as https from 'https';
import { HttpService } from '@nestjs/axios';
import { CardPaymentDto } from './dto/card.payments.dto';
import { generateMerchantKey } from 'src/utilities/utils';
import {
  PAYSWITCH_APIKEY_PROD,
  PAYSWITCH_TEST_BASEURL,
  PAYSWTICH_PROD_BASEURL,
  PAYSWITCH_CHECKOUT_URL,
  PAYSWITCH_USERNAME_PROD,
  PAYSWITCH_MERCHANTID,
  RESPONSE_URL,
} from 'src/constants';
import { CallbackDto } from './dto/callback.dto';
import { InlinePayDto } from './dto/inline.pay.dto';
import { psRandomGeneratedNumber } from 'src/utilities/ps.utils';

@Injectable()
export class PscardpaymentService {
  private logger = new Logger(PscardpaymentService.name);

  constructor(private httpService: HttpService) {}

  public psCallback(
    transDto: CallbackDto,
  ): Observable<AxiosResponse<CallbackDto>> {
    const { status, transactionId, description, amount } = transDto;

    const psParam: any = {
      status,
      transaction_id: transactionId || '',
      reason: description || '',
      amount,
    };

    const configs = {
      url: '',
      body: psParam,
    };
    this.logger.log(`test post payload == ${JSON.stringify(configs)}`);
    return this.httpService.post(configs.url, configs.body).pipe(
      map((wcRes) => {
        this.logger.log(
          `service response STATUS ==  ${JSON.stringify(wcRes.data)}`,
        );
        return wcRes.data;
      }),
    );
  }

  public inlinePayments(
    transDto: InlinePayDto,
  ): Observable<AxiosResponse<CardPaymentDto>> {
    const { description, amount, redirectURL, customerEmail, transId } =
      transDto;

    const ipParams: any = {
      merchant_id: PAYSWITCH_MERCHANTID,
      transaction_id: psRandomGeneratedNumber() || transId,
      desc: description,
      amount,
      redirect_url: redirectURL || RESPONSE_URL,
      email: customerEmail || '',
    };

    const configs = {
      url:   PAYSWITCH_CHECKOUT_URL + '/initiate',
      body: ipParams,
      auth: {
        username: `${PAYSWITCH_USERNAME_PROD}`,
        password: `${PAYSWITCH_APIKEY_PROD}`,
      },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };

    this.logger.log(
      `INLINE PAYMENT payload config == ${JSON.stringify(configs)}`,
    );
    return this.httpService
      .post(configs.url, configs.body, {
        httpsAgent: configs.agent,
        auth: configs.auth,
      })
      .pipe(
        map((ipRes) => {
          this.logger.verbose(
            `INLINE PAYMENT server response => ${JSON.stringify(ipRes.data)}`,
          );
          return ipRes.data;
        }),
        catchError((ipError) => {
          this.logger.error(`ERROR INLINE PAYMENT => ${JSON.stringify(ipError.data)}`);
          const ipErrorMessage = ipError.response.data;
          throw new NotFoundException(ipErrorMessage);
        }),
      );
  }

  public cardPayment(
    transDto: CardPaymentDto,
  ): Observable<AxiosResponse<CardPaymentDto>> {
    const {
      merchantId,
      amount,
      pan,
      cardHolderName,
      customerEmail,
      currency,
      expYear,
      expMonth,
      cvv,
      primaryCallbackUrl,
    } = transDto;

    const cpParams: any = {
      processing_code: '000000',
      'r-switch': 'VIS',
      transaction_id: psRandomGeneratedNumber() || '',
      merchant_id: merchantId || '',
      pan: pan || '4310000000000000',
      exp_month: expMonth || '05',
      exp_year: expYear || '21',
      cvv: cvv || '000',
      desc: 'Card Payment Test',
      amount: amount || '000000000100',
      currency: currency || 'GHS',
      card_holder: cardHolderName || 'Card Holder Name',
      customer_email: customerEmail || 'Customer Email',
      '3d_url_response': primaryCallbackUrl || '',
    };

    const base64_encode = generateMerchantKey();

    const configs = {
      url: PAYSWITCH_TEST_BASEURL + '/v1.1/transaction/process',
      body: cpParams,
      headers: {
        Authorization: `Basic ${base64_encode}`,
      },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };

    this.logger.log(
      `CARD PAYMENT payload config == ${JSON.stringify(configs)}`,
    );
    return this.httpService
      .post(configs.url, configs.body, {
        httpsAgent: configs.agent,
        headers: configs.headers,
      })
      .pipe(
        map((tmRes) => {
          this.logger.verbose(
            `CARD PAYMENT server response => ${JSON.stringify(tmRes.data)}`,
          );
          // if (res.data.Status === 0) {
          //     this.logger.error(`debit wallet service response STATUS =  ${JSON.stringify(res.data.Status)}`);
          //     this.logger.error(`service response MESSAGE =  ${JSON.stringify(res.data.Message)}`);
          //     this.logger.error(`service response DETAILS = ${JSON.stringify(res.data.Details)}`);
          // } else if (res.data.Status === 1) {
          //     this.logger.debug(`debit wallet  service response TRANSACTION ID == ${JSON.stringify(res.data.Transactionid)}`);
          //     this.logger.debug(`service response STATUS ==  ${JSON.stringify(res.data.Status)}`);
          //     this.logger.debug(`response MESSAGE ==  ${JSON.stringify(res.data.Message)}`);
          //     this.logger.debug(`response MERCHANT REFERENCE == ${JSON.stringify(res.data.MerchantReference)}`);
          // } else if (res.data.Status === 2) {
          //     this.logger.warn(`debit wallet service response STATUS =  ${JSON.stringify(res.data.Status)}`);
          //     this.logger.warn(`service response MESSAGE =  ${JSON.stringify(res.data.Message)}`);
          //     this.logger.warn(`service response TRANSACTIONID = ${JSON.stringify(res.data.transactionid)}`);
          // }

          return tmRes.data;
        }),
        catchError((Sm2Error) => {
          this.logger.error(`ERROR CARD PAYMENT => ${JSON.stringify(Sm2Error.response.data)}`);
          const Sm2ErrorMessage =  Sm2Error.response.data;
          throw new NotFoundException(Sm2ErrorMessage)
        }),
      );
  }
}
