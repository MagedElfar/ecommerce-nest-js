import { PasswordService } from './password.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/request/signup.dto';
import { Request as Req } from 'express';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/request/login.dto';
import { SignupResponseDto } from './dto/response/signup.dto';
import { LoginResponseDto } from './dto/response/login.dto';
import { SendForgetPasswordEmailDto } from './dto/request/forget-password-email.dto';
import { ForgetPasswordRestDto } from './dto/request/forget-password-rest.dto';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly passwordService: PasswordService
    ) { }

    @Public()
    @Post('signup')
    @ApiCreatedResponse({
        description: "succuss request",
        type: SignupResponseDto,

    })
    async signUp(@Body() signUpDto: SignUpDto) {
        try {
            return await this.authService.create(signUpDto);

        } catch (error) {
            throw error
        }
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
            throw error

        }
    }

    @Public()
    @Post('forget-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'forget password "change or rest password"'
    })
    @ApiOkResponse({
        description: "succuss request",
    })
    async forgetPasswordRest(@Body() forgetPasswordRestDto: ForgetPasswordRestDto) {
        try {
            await this.passwordService.forgetPasswordRest(forgetPasswordRestDto);

            return { message: "your password rest successfully" }
        } catch (error) {
            throw error
        }
    }

    @Public()
    @Post('forget-password/email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'forget password "send forget password email"'
    })
    @ApiOkResponse({
        description: "succuss request",
    })
    async forgetPasswordEmail(@Body() sendForgetPasswordEmailDto: SendForgetPasswordEmailDto) {
        try {
            await this.passwordService.sendForgetPasswordEmail(sendForgetPasswordEmailDto);

            return { message: "forget password email has sent" }
        } catch (error) {
            console.log(error)
            throw error

        }
    }

}
