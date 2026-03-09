import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// TODO: 替换为 Prisma 服务
// import { PrismaService } from '../common/prisma.service';

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    // private prisma: PrismaService,
  ) {}

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;
    
    // TODO: 检查用户是否已存在
    // const existingUser = await this.prisma.user.findFirst({
    //   where: { OR: [{ email }, { username }] },
    // });
    // if (existingUser) {
    //   throw new ConflictException('邮箱或用户名已存在');
    // }
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // TODO: 创建用户
    // const user = await this.prisma.user.create({
    //   data: {
    //     email,
    //     username,
    //     password: hashedPassword,
    //   },
    // });
    
    // 模拟用户创建（临时）
    const user = {
      id: '1',
      email,
      username,
      role: 'SALESMAN' as const,
    };
    
    const token = this.generateToken(user);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // TODO: 查找用户
    // const user = await this.prisma.user.findUnique({
    //   where: { email },
    // });
    // if (!user) {
    //   throw new UnauthorizedException('邮箱或密码错误');
    // }
    
    // 模拟用户查找（临时）
    const user = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      password: await bcrypt.hash('password123', 10),
      role: 'SALESMAN' as const,
    };
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    
    const token = this.generateToken(user);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }

  /**
   * 生成 JWT Token
   */
  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    
    return this.jwtService.sign(payload);
  }

  /**
   * 验证 Token
   */
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token 无效或已过期');
    }
  }
}
