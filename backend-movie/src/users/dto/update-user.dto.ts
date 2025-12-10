import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'ID is invalid' })
  @IsNotEmpty({ message: 'ID is required' })
  _id: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
