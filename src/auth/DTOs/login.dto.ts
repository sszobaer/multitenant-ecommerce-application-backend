import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'User email address used for login',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'secret123',
    description: 'User password',
    minLength: 6,
  })
  @MinLength(6)
  password!: string;
}
