import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/ulis';
import { UsersService } from 'src/users/users.service';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException('Username - Password không hợp lệ');
    }

    const isValidPassword = await comparePasswordHelper(pass, user?.password);
    if (!user || !isValidPassword) return null;
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id, role: user.role || 'USER' };
    return {
      user: {
        email: user.email,
        id: user._id,
        name: user.full_name,
        phone: user.phone,
        role: user.role || 'USER',
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    //check email
    return await this.usersService.handleRegister(registerDto);
    //hashpassword
  };

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data);
  };

  retryActive = async (data: string) => {
    return await this.usersService.retryActive(data);
  };

  retryPassword = async (data: string) => {
    return await this.usersService.retryPassword(data);
  };

  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.usersService.changePassword(data);
  };
}
