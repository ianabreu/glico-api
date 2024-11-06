import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateUserDto) {
    if (payload.password !== payload.confirmationPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }
    const userAlreadyExists = await this.findByEmail(payload.email);
    if (userAlreadyExists) {
      throw new BadRequestException('Usuário já cadastrado');
    }
    const hashPassword = await bcrypt.hash(payload.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
      },
      select: { id: true, email: true },
    });
    return user;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: { id: true, email: true },
    });
  }
  async findOne(id: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(
          'Usuário com o ID informado não foi encontrado',
        );
      } else {
        console.log(error);
        throw new InternalServerErrorException(
          'Ocorreu um erro ao processar sua solicitação.',
        );
      }
    }
  }
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: { id: true, email: true },
    });
    return user;
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
        select: { id: true, email: true },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(
          'Usuário com o ID informado não foi encontrado',
        );
      } else {
        console.log(error);
        throw new InternalServerErrorException(
          'Ocorreu um erro ao processar sua solicitação.',
        );
      }
    }
  }
}
