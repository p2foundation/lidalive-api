import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasherService } from './password.hasher.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityInterface } from './interface/security.interface';
import { JWT_EXPIRE } from '../constants';
import { SecurityDto } from './dto/security.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SecurityService {
  private logger = new Logger('SecurityService');

  constructor(
    @InjectModel('Users')
    private readonly userModel: Model<SecurityInterface>,
    private passwordHaSherService: PasswordHasherService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  public async userProfile(userId: string): Promise<any> {
    this.logger.debug(`userId: ${userId}`);
    return await this.userModel.findById(userId).exec();
  }
  public async signUp(userData: SecurityInterface): Promise<SecurityInterface> {
    console.log(`register userData: ${JSON.stringify(userData)}`);

    const user = await this.userModel.findOne({
      $or: [{ email: userData.email }, { userName: userData.userName }],
    });
    if (user) {
      throw new UnauthorizedException(
        `User already created with this: ${userData.email}`,
      );
    }
    const encryptedPassword = await this.passwordHaSherService.hashPassword(
      userData.password,
    );

    const newUser = new this.userModel({
      userName: userData.userName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      mobile: userData.mobile,
      gravatar: userData.photo || userData.gravatar || '',
      status: userData.status,
      password: encryptedPassword,
    });

    try {
      this.logger.debug(`new user registered successfully ${newUser}`);
      return await newUser.save();
    } catch (e) {
      console.error(`error registering new user ==> ${e}`);
      throw new InternalServerErrorException();
    }
  }

  public async login(userData: SecurityDto): Promise<any> {
    console.log(`userData: ${JSON.stringify(userData)}`);
    const user = await this.userModel.findOne({
      $or: [{ email: userData.email }, { userName: userData.userName }],
    }); // find user email or userName from the Database
    console.log(`user found? ${user}`);

    // verify user email
    if (!user) {
      throw new UnauthorizedException(
        `Invalid credentials ==> ${JSON.stringify(userData)}`,
      );
    }
    // verify user password
    const matchedPassword = await this.passwordHaSherService.comparePasswords(
      userData.password,
      user.password,
    );
    if (matchedPassword) {
      // generate JSON web token
      const token = await this.jwtService.signAsync(
        { email: userData.email || userData.userName, id: user._id },
        { expiresIn: JWT_EXPIRE },
      );
      this.logger.debug(`user successfully login (token) ==> ${token}`);
      return { token, user };
    } else {
      throw new UnauthorizedException(`Invalid password`);
    }
  }

  public async validateUserById(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (user) {
      return true;
    } else {
      return false;
    }
    // return !!user;
  }
}
