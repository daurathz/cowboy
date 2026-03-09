import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from './customer.service';

// TODO: 添加 AuthGuard
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('客户')
@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建客户' })
  async create(@Body() data: any) {
    // TODO: 从 JWT 获取 userId
    const userId = '1';
    return this.customerService.create(data, userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取客户列表' })
  async findAll() {
    const userId = '1';
    const role = 'SALESMAN';
    return this.customerService.findAll(userId, role);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取客户详情' })
  async findOne(@Param('id') id: string) {
    return this.customerService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新客户' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.customerService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除客户' })
  async remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
