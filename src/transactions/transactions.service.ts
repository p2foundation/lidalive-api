import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  private logger = new Logger(TransactionsService.name);

  constructor(private readonly httpService: HttpService) {}
}
