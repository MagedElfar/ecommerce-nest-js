import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/signup.dto';
import { Request as Req } from 'express';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(AuthGuard("local"))
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req: Req) {
        return this.authService.login(req.user);
    }

    @Public()
    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        return await this.authService.create(signUpDto);
    }
}
