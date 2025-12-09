import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Username không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsOptional()
  full_name: string;

  @IsOptional()
  phone: number;
}
export class CodeAuthDto {
  @IsNotEmpty({ message: 'Id không hợp lệ' })
  _id: string;

  @IsNotEmpty({ message: 'Code không hợp lệ' })
  code: string;
}
export class ChangePasswordAuthDto {
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'ConfirmPassword không được để trống' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}
