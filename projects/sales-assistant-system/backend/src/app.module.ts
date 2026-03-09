import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { DealModule } from './deal/deal.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 功能模块
    AuthModule,
    UserModule,
    CustomerModule,
    DealModule,
  ],
})
export class AppModule {}
