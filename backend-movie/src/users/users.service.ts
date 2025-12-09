import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/ulis';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  //Check email xem tồn tài ko
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email: email });
    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    const { full_name, email, password, phone } = createUserDto;

    //Check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(
        `Email đã tồn tại: ${email}. Vui lòng thử lại`,
      );
    }

    ///hash password
    const hashPassword = await hashPasswordHelper(password);

    const user = await this.userModel.create({
      full_name,
      email,
      password: hashPassword,
      phone,
    });
    return {
      _id: user._id,
    };
  }

  async findAll(querry: string, current: number, pagesize: number) {
    const { filter, sort } = aqp(querry);
    if (filter.current) delete filter.current;
    if (filter.pagesize) delete filter.pagesize;

    if (!current) current = 1;
    if (!pagesize) pagesize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pagesize);

    const skip = (+current - 1) * pagesize;

    const result = await this.userModel
      .find(filter)
      .limit(pagesize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);
    return {
      meta: {
        current: current,
        pagesize: pagesize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto },
      { ...updateUserDto },
    );
  }

  async remove(_id: string) {
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Id không dùng định dạng đúng mongdb');
    }
  }

  async handleRegister(register: CreateAuthDto) {
    const { full_name, email, password, phone } = register;

    //Check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(
        `Email đã tồn tại: ${email}. Vui lòng thử lại`,
      );
    }

    ///hash password
    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      full_name,
      email,
      password: hashPassword,
      phone,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'days'),
    });

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account at MovieWebApp', // Subject line
      template: 'register', // HTML body content
      context: {
        name: user?.full_name ?? user.email,
        activationCode: codeId,
      },
    });
    return {
      _id: user._id,
    };
  }
  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code,
    });
    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ & Đã hết hạn');
    }

    //Check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      // valid
      await this.userModel.updateOne(
        { _id: data._id },
        {
          isActive: true,
        },
      );
      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ & Đã hết hạn');
    }
  }

  async retryActive(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }
    //send email
    const codeId = uuidv4();

    //update email
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });
    //send email
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Active your password account at @Group7',
      template: 'register',
      context: {
        name: user?.full_name ?? user.email,
        activationCode: codeId,
      },
    });
    return { _id: user._id };
  }

  async retryPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    //send email
    const codeId = uuidv4();

    //update email
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes').toDate(),
    });
    //send email
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Change your password account at @Group7',
      template: 'register',
      context: {
        name: user?.full_name ?? user.email,
        activationCode: codeId,
      },
    });
    return { _id: user._id, email: user.email };
  }

  async changePassword(data: ChangePasswordAuthDto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException(
        'Mật khẩu/Xác nhận mật khẩu không chính xác',
      );
    }
    //Check email
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    //Check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      // valid => update Password
      const newPassword = await hashPasswordHelper(data.password);
      await user.updateOne({ password: newPassword });
      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ & Đã hết hạn');
    }
  }
}
