import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  confirmationPassword: string;
}
