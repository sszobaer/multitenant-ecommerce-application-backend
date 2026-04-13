import { IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateTenantDto {

  @IsNotEmpty({ message: 'Tenant name is required' })
  @MaxLength(100, { message: 'Tenant name must be less than 100 characters' })
  name!: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}