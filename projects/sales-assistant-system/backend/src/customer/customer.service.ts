import { Injectable } from '@nestjs/common';

// TODO: 替换为 Prisma 服务
// import { PrismaService } from '../common/prisma.service';

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  position?: string;
  source?: string;
  status: 'LEAD' | 'CONTACTED' | 'INTERESTED' | 'NEGOTIATING' | 'CLOSED' | 'LOST';
  assignedTo: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CustomerService {
  // constructor(private prisma: PrismaService) {}

  /**
   * 创建客户
   */
  async create(data: Partial<Customer>, userId: string): Promise<Customer> {
    // TODO: 创建数据库记录
    const customer: Customer = {
      id: '1',
      name: data.name || '',
      phone: data.phone,
      email: data.email,
      company: data.company,
      position: data.position,
      source: data.source,
      status: data.status || 'LEAD',
      assignedTo: userId,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return customer;
  }

  /**
   * 获取客户列表
   */
  async findAll(userId: string, role: string): Promise<Customer[]> {
    // TODO: 根据角色过滤
    // - SALESMAN: 只看自己的客户
    // - SUPERVISOR/ADMIN: 看所有客户
    return [];
  }

  /**
   * 获取客户详情
   */
  async findById(id: string): Promise<Customer> {
    // TODO: 从数据库查询
    return {
      id,
      name: '测试客户',
      status: 'LEAD',
      assignedTo: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * 更新客户
   */
  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    // TODO: 更新数据库
    return {
      id,
      name: data.name || '测试客户',
      status: data.status || 'LEAD',
      assignedTo: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * 删除客户
   */
  async remove(id: string): Promise<void> {
    // TODO: 删除数据库记录
  }
}
