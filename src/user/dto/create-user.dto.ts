import { User } from '@prisma/client';

export class CreateUserDto implements Omit<User, 'id'> {
  email: string;
  password: string;
}
