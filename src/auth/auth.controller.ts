import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import BaseResponse from '../response';
import WhoAmIDto from './dto/who-am-i.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginDto: LoginDto): Promise<BaseResponse> {
    return await this.authService.login(loginDto);
  }

  @Post('wai/')
  async whoAmI(@Body() whoAmIDto: WhoAmIDto): Promise<BaseResponse> {
    return await this.authService.whoAmI(whoAmIDto);
  }
}
