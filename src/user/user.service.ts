import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
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

  update(id: string, updateUserDto: any) {
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
