import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import BaseResponse from '../response';
import WhoAmIDto from './dto/who-am-i.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async whoAmI(whoAmIDto: WhoAmIDto): Promise<BaseResponse> {
    const user: { kassza: string; name: string } = await this.jwtService.decode(
      whoAmIDto.token,
    );
    console.log('WhoAmI', user);
    if (!user) {
      return BaseResponse.from({
        status: 800,
        message: 'Invalid token',
        data: [],
      });
    }
    return BaseResponse.from({
      status: 200,
      message: 'User information retrieved successfully',
      data: [user],
    });
  }

  async login(loginDto: LoginDto): Promise<BaseResponse> {
    let success = false;
    switch (loginDto.kassza) {
      case 1:
        if (loginDto.password === process.env.KASSZA1_KEY) {
          success = true;
        }
        break;
      case 2:
        if (loginDto.password === process.env.KASSZA2_KEY) {
          success = true;
        }
        break;
      default:
        success = false;
    }
    const token = await this.jwtService.signAsync({
      kassza: loginDto.kassza,
      name: loginDto.name,
    });
    return BaseResponse.from({
      status: success ? 200 : 800,
      message: success ? 'Login successful' : 'Login failed',
      data: success ? [token] : [],
    });
  }
}
