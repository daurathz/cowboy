import { Controller, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';

// TODO: 添加 AuthGuard
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('用户')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  async getProfile() {
    // TODO: 从 JWT token 中获取 userId
    const userId = '1'; // 临时
    return this.userService.findById(userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有用户（主管/管理员）' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取指定用户信息' })
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
