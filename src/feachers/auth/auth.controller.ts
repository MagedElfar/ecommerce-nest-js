import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/signup.dto';
import { Request as Req } from 'express';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiHideProperty, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse, OmitType } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthSchema } from 'src/utility/swagger/schema/auth.schema';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('signup')
    @ApiCreatedResponse({
        description: "succuss request",
        type: AuthSchema,

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
        type: AuthSchema,
    })
    async login(@Request() req: Req) {
        try {
            return await this.authService.login(req.user);
        } catch (error) {
            console.log(error)
        }
    }

}
