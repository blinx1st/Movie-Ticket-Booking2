import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import mongoose, { Model, HydratedDocument } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/ulis';
import aqp from 'api-query-params';
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

  // Check email xem tồn tại không
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email: email });
    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    const { full_name, email, password, phone } = createUserDto;

    // Check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(
        `Email đã tồn tại: ${email}. Vui lòng thử lại`,
      );
    }

    // hash password
    const hashPassword = await hashPasswordHelper(password);

    const user = await this.userModel.create({
      full_name,
      email,
      password: hashPassword,
      phone,
      isActive: true, // Admin-created accounts are active immediately
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

  async findByFlexibleId(id: string): Promise<HydratedDocument<User>> {
    const isObjectId = mongoose.isValidObjectId(id);
    let user: HydratedDocument<User> | null = null;
    if (isObjectId) {
      user = await this.userModel.findById(id).select('-password');
    }
    if (!user) {
      // fallback: treat id as email
      user = await this.userModel.findOne({ email: id }).select('-password');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    const { _id, id, full_name, email, phone, password } =
      updateUserDto as any;
    const targetId = _id || id;
    if (!targetId) {
      throw new BadRequestException('User id is required');
    }

    const updatePayload: any = {};
    if (full_name !== undefined) updatePayload.full_name = full_name;
    if (email !== undefined) updatePayload.email = email;
    if (phone !== undefined && phone !== null && phone !== '') {
      const phoneNum = Number(phone);
      if (Number.isNaN(phoneNum)) {
        throw new BadRequestException('Phone must be numeric');
      }
      updatePayload.phone = phoneNum;
    }
    if (password !== undefined) updatePayload.password = password;

    const isObjectId = mongoose.isValidObjectId(targetId);
    let updated;
    if (isObjectId) {
      updated = await this.userModel.findByIdAndUpdate(
        targetId,
        updatePayload,
        { new: true },
      );
    } else if (email) {
      // fallback update by email if id is not a valid ObjectId (avoid cast errors)
      updated = await this.userModel.findOneAndUpdate(
        { email },
        updatePayload,
        { new: true },
      );
    } else {
      throw new BadRequestException('User id is invalid');
    }
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Id không đúng định dạng MongoDB');
    }

    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const isAdmin = (user.role || '').toUpperCase().includes('ADMIN');
    if (isAdmin) {
      throw new BadRequestException('Không thể xóa tài khoản ADMIN');
    }

    return this.userModel.deleteOne({ _id });
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
    // Require matching email + code to avoid replay
    const user = await this.userModel.findOne({
      email: data.email,
      codeId: data.code,
    });
    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ & Đã hết hạn');
    }

    // Check expire code
    const isBeforeCheck =
      !!user.codeExpired && dayjs().isBefore(dayjs(user.codeExpired));
    if (!isBeforeCheck) {
      throw new BadRequestException('Mã code không hợp lệ & Đã hết hạn');
    }

    // valid => update Password and clear reset code
    const newPassword = await hashPasswordHelper(data.password);
    await user.updateOne({
      password: newPassword,
      codeId: null,
      codeExpired: null,
    });
    return { data: true };
  }
}
