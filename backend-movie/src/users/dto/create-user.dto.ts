import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Phải điền name' })
  full_name: string;

  @IsNotEmpty({ message: 'Phải điền PhoneNumber' })
  phone: number;

  @IsNotEmpty({ message: 'Phải điền Email' })
  @IsEmail({}, { message: 'Must be an valid Email' })
  email: string;

  @IsNotEmpty({ message: 'Phải điền Password' })
  password: string;
}
