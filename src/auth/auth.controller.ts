import {
  Body,
  Controller,
  Post,
  Get,
  HttpStatus,
  Res,
  Param,
  Delete,
  Put,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { UserInterface } from './interface/user.interface';
import { AppService } from '../app.service';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  async loginUser(@Body() userData: UserDto): Promise<UserInterface> {
    console.log(`signIn - incoming: ${JSON.stringify(userData)}`);
    const lu = await this.authService.login(userData);
    return lu;
  }

  @Post('signup')
  async signUpUser(@Body() userData: UserDto): Promise<any> {
    // console.log(`register userData: ${userData}`);
    const su = await this.authService.signUp(userData);
    this.logger.log('registered users: ' + su);

    return su;
  }
  @Get('user/:userId')
  async getUserById(
    @Res() res: Response,
    @Param('userId') userId: string,
  ): Promise<any> {
    const gubi = await this.authService.getUserById(userId);
    res.status(HttpStatus.OK).json(gubi);
  }
  @Get('employees')
  async findAllEmployees(@Res() res: Response): Promise<any> {
    const fae = await this.authService.findAllEmployees();
    res.status(HttpStatus.OK).json(fae);
  }
  @Get('users')
  async getAllUsers(@Res() res: Response): Promise<any> {
    const gau = await this.authService.getAllRegisteredUsers();
    res.status(HttpStatus.OK).json(gau);
  }

  @Put('profile/:userId')
  async updateUserProfile(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Body() changes: UserDto,
  ): Promise<any> {
    console.log(`userProfile ${userId}: ${changes}`);
    const u2p = await this.authService.newMemberUpdate(userId, changes);
    res.status(HttpStatus.CREATED).send(u2p);
  }
  @Delete('remove/:userId')
  async deleteUserAccount(
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<any> {
    const dua = await this.authService.deleteUserAccount(userId);
    console.log(`user account with Id: ${userId} is successfully deleted`);
    console.log(`user account successfully deleted => ${dua} `);
    res.status(HttpStatus.CREATED).send(dua);
  }
  @Delete('/remove/all')
  public async deleteAllUserAccounts(@Res() res: Response): Promise<any> {
    const daua = await this.authService.deleteAllUsers();
    res.status(HttpStatus.CREATED).send(daua);
  }
}
