import { Injectable } from '@nestjs/common';

// TODO: 替换为 Prisma 服务
// import { PrismaService } from '../common/prisma.service';

export interface Deal {
  id: string;
  customerId: string;
  salesId: string;
  product: string;
  quantity: number;
  amount: number;
  status: 'PENDING' | 'SIGNED' | 'PAID' | 'COMPLETED' | 'CANCELLED';
  contractNo?: string;
  signedAt?: Date;
  paidAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class DealService {
  // constructor(private prisma: PrismaService) {}

  /**
   * 创建成交记录
   */
  async create(data: Partial<Deal>, userId: string): Promise<Deal> {
    const deal: Deal = {
      id: '1',
      customerId: data.customerId || '',
      salesId: userId,
      product: data.product || '',
      quantity: data.quantity || 1,
      amount: data.amount || 0,
      status: data.status || 'PENDING',
      paidAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return deal;
  }

  /**
   * 获取成交列表
   */
  async findAll(userId: string, role: string): Promise<Deal[]> {
    // TODO: 根据角色过滤
    return [];
  }

  /**
   * 获取成交详情
   */
  async findById(id: string): Promise<Deal> {
    return {
      id,
      customerId: '1',
      salesId: '1',
      product: '测试产品',
      quantity: 1,
      amount: 10000,
      status: 'PENDING',
      paidAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * 更新成交
   */
  async update(id: string, data: Partial<Deal>): Promise<Deal> {
    return {
      id,
      customerId: '1',
      salesId: '1',
      product: data.product || '测试产品',
      quantity: data.quantity || 1,
      amount: data.amount || 10000,
      status: data.status || 'PENDING',
      paidAmount: data.paidAmount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * 删除成交
   */
  async remove(id: string): Promise<void> {
    // TODO: 删除数据库记录
  }
}
