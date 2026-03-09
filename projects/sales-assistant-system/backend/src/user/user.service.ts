import { Injectable, NotFoundException } from '@nestjs/common';

// TODO: 替换为 Prisma 服务
// import { PrismaService } from '../common/prisma.service';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'SALESMAN' | 'SUPERVISOR' | 'ADMIN';
}

@Injectable()
export class UserService {
  // constructor(private prisma: PrismaService) {}

  /**
   * 获取当前用户信息
   */
  async findById(id: string): Promise<User> {
    // TODO: 从数据库查询
    // const user = await this.prisma.user.findUnique({
    //   where: { id },
    //   select: {
    //     id: true,
    //     email: true,
    //     username: true,
    //     role: true,
    //   },
    // });
    // if (!user) {
    //   throw new NotFoundException('用户不存在');
    // }
    // return user;
    
    // 模拟返回
    return {
      id,
      email: 'test@example.com',
      username: 'testuser',
      role: 'SALESMAN',
    };
  }

  /**
   * 获取所有用户（主管/管理员权限）
   */
  async findAll(): Promise<User[]> {
    // TODO: 从数据库查询所有用户
    return [];
  }

  /**
   * 更新用户信息
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    // TODO: 更新数据库
    return {
      id,
      email: 'test@example.com',
      username: 'testuser',
      role: 'SALESMAN',
    };
  }
}
