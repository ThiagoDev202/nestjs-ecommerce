import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config'


@Module({
  imports: [
    UserModule, // manage user information
    PassportModule, // authentication feature
    // users's register with JWT  
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // JWToken with 1 hour expiration date
      signOptions: { expiresIn: '3600s' },
      // After this timer, user must log in again
    }),
  ],
  providers: [
    AuthService, // authentication logic
    LocalStrategy, // user's name and password
    JwtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule {}