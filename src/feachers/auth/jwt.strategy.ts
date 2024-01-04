import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("jwt.secret"),
        });
    }


    async validate(payload: any) {

        // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA0MzgwNjg0LCJleHAiOjE3MDQ1NTM0ODR9.IfXZAhC_X6qcOtwmvmMFt529dTjMa1Cw6DhsZAQk8eA

        console.log("swagger")
        const user = await this.userService.findById(payload.id);

        if (!user) {
            throw new UnauthorizedException('You are not authorized to perform the operation');
        }

        return user;
    }
}