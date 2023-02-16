import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SecuritySchema } from './schema/security.schema';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../constants';
import { PasswordHasherService } from './password.hasher.service';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({ secret: JWT_SECRET }),
    MongooseModule.forFeature([{ name: 'Users', schema: SecuritySchema }]),
  ],
  providers: [SecurityService, PasswordHasherService, JwtStrategy],
  controllers: [SecurityController],
})
export class SecurityModule {}
