import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordHasherService } from './password.hasher.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import { UserInterface } from './interface/user.interface';
import { JWT_EXPIRE } from '../constants';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectModel('Users')
    private readonly userModel: Model<UserInterface>,
    private passwordHaSherService: PasswordHasherService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async signUp(userData: Partial<UserDto>): Promise<UserInterface> {
    console.log(`register userData: ${JSON.stringify(userData.email)}`);
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
      otherName: userData.otherName,
      email: userData.email,
      mobile: userData.mobile,
      status: userData.status,
      gravatar: userData.photo || userData.gravatar || '',
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

  async login(userData: UserDto): Promise<any> {
    const user = await this.userModel.findOne({
      $or: [{ email: userData.email }, { userName: userData.userName }],
    }); // find user email or userName from the Database
    console.log(`user found? ${user}`);
    // const email = user.basicInfo.email;
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
      // generate JSON we b token
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

  public async getAllRegisteredUsers(): Promise<any> {
    const users = await this.userModel.find().exec();
    const totalCount = await this.userModel.countDocuments();

    this.logger.verbose(`Registered users totalCount: ${totalCount}`);
    return { users, totalCount };
  }

  public async getUserById(userId: string): Promise<UserInterface> {
    const user = await this.userModel.findById(userId).exec();
    this.logger.verbose(`find userById: ${user}`);
    return user;
  }

  public async newMemberUpdate(
    userId: string,
    changes: Partial<UserDto>,
  ): Promise<UserInterface> {
    const nmu = await this.userModel.findOneAndUpdate(
      { _id: userId },
      changes,
      { new: true },
    );
    return nmu;
  }

  public async deleteUserAccount(userId: string): Promise<any> {
    const rm = await this.userModel.deleteOne({ _id: userId });
    return rm;
  }

  public async deleteAllUsers(): Promise<any> {
    const dau = await this.userModel.deleteMany({});
    return dau;
  }

  public async nextBirthDayWishList(): Promise<any> {
    try {
      const users = await this.userModel.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    { $dayOfMonth: '$dateOfBirth' },
                    { $dayOfMonth: new Date() },
                  ],
                },
                { $eq: [{ $month: '$dateOfBirth' }, { $month: new Date() }] },
              ],
            },
          },
        },
      ]);

      this.logger.verbose(`birthdayOfToday: ==> ${JSON.stringify(users)}`);
      return users;
    } catch (e) {
      this.logger.error(`error birthday wish list: ${e}`);
    }
  }

  public async birthDayOfMonth(): Promise<any> {
    const users = await this.userModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: '$dateOfBirth' }, { $month: new Date() }],
          },
        },
      },
    ]);
    try {
      this.logger.verbose(`birthdayOfMonth lists: ${JSON.stringify(users)}`);
      return users;
    } catch (e) {
      this.logger.error(`error birthDayOfMonth: ${JSON.stringify(e)}`);
    }
  }

  public async findAllEmployees(): Promise<UserInterface[]> {
    const fae = await this.userModel.find().exec();
    this.logger.debug(`list allEmployees: ${JSON.stringify(fae)}`);
    return fae;
  }

  async validateUserById(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (user) {
      return true;
    } else {
      return false;
    }
    // return !!user;
  }
}
