import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    // TODO: 从数据库验证用户是否存在
    // const user = await this.prisma.user.findUnique({
    //   where: { id: payload.sub },
    // });
    // if (!user) {
    //   throw new UnauthorizedException('用户不存在');
    // }
    
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
  }
}
