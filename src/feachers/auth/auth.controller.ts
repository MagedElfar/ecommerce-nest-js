import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignResponseUpDto, SignUpDto } from './dto/signup.dto';
import { Request as Req } from 'express';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('signup')
    @ApiCreatedResponse({
        description: "succuss request",
        type: SignResponseUpDto,

    })
    async signUp(@Body() signUpDto: SignUpDto) {
        return await this.authService.create(signUpDto);
    }

    @Public()
    @UseGuards(AuthGuard("local"))
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: "succuss request",
        type: LoginResponseDto,
    })
    async login(@Request() req: Req, @Body() loginDto: LoginDto) {
        try {
            return await this.authService.login(req.user);
        } catch (error) {
            console.log(error)
        }
    }

}
