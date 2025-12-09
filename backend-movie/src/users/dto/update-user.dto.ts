import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({ message: 'Không hợp lệ' })
  @IsNotEmpty({ message: 'ID không được để trống' })
  _id: string;

  @IsOptional()
  full_name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  phone: number;

  @IsOptional()
  password: string;
}
