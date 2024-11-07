import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register({ email, password, confirmationPassword }: RegisterDto) {
    if (password !== confirmationPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }
    const userAlreadyExists = await this.userService.findByEmail(email);

    if (userAlreadyExists) {
      throw new BadRequestException('Email já cadastrado');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      email,
      password: hashPassword,
    });
    return user;
  }
  async login({ email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuário/senha incorreto');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Usuário/senha incorreto');
    }
    const access_token = sign({ email: user.email }, process.env.SECRET_JWT, {
      subject: user.id,
      expiresIn: '30d',
    });
    return {
      id: user.id,
      email: user.email,
      access_token,
    };
  }
  async profile(userId: string) {
    return this.userService.findOne(userId);
  }
}
