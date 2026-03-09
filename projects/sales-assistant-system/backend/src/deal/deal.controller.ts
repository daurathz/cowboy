import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DealService } from './deal.service';

@ApiTags('成交')
@Controller('deals')
export class DealController {
  constructor(private dealService: DealService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建成交记录' })
  async create(@Body() data: any) {
    const userId = '1';
    return this.dealService.create(data, userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取成交列表' })
  async findAll() {
    const userId = '1';
    const role = 'SALESMAN';
    return this.dealService.findAll(userId, role);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取成交详情' })
  async findOne(@Param('id') id: string) {
    return this.dealService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新成交' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.dealService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除成交' })
  async remove(@Param('id') id: string) {
    return this.dealService.remove(id);
  }
}
