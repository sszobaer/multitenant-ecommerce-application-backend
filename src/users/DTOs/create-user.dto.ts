import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsUUID, IsIn } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  name!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password!: string;

  
  @IsNotEmpty({ message: 'Role is required' })
  @IsIn(['admin', 'manager', 'staff'], {
    message: 'Role must be admin, manager, or staff'
  })
  role!: string;

  @IsNotEmpty({ message: 'Tenant ID is required' })
  @IsUUID('4', { message: 'Tenant ID must be a valid UUID' })
  tenant_id!: string;
}