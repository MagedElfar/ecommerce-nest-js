import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signup.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/feachers/users/users.interface';
import { UserScop } from '../../users/user.entity';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService
    ) { };

    public async login(user: Partial<IUser>) {
        try {

            const token = await this.generateToken({ id: user.id })

            user = await this.usersService.findById(user.id, [
                UserScop.EXCLUDE_PASSWORD,
                UserScop.WITH_Media,
                UserScop.WITH_PHONE,
                UserScop.WITH_ADDRESS
            ])

            return { user: user, token };

        } catch (error) {
            throw error
        }
    }

    public async create(signUpDto: SignUpDto) {

        const user = await this.usersService.findOne({
            email: signUpDto.email
        })

        if (user) throw new ConflictException('This email already exist');

        // hash the password
        const pass = await this.passwordService.hashPassword(signUpDto.password);

        // create the user
        const newUser = await this.usersService.create({ ...signUpDto, password: pass });

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser;

        // generate token
        const token = await this.generateToken({ id: result.id });

        return { user: result, token };
    }


    async validateUser(loginDto: LoginDto) {
        try {
            const user = await this.usersService.findOne({ email: loginDto.email });

            if (!user) return null

            // find if user password match
            const match = await this.passwordService.comparePassword(loginDto.password, user.password);

            if (!match) {
                return null;
            }

            // tslint:disable-next-line: no-string-literal
            const { password, ...result } = user;

            return result;

        } catch (error) {
            throw error
        }
    }

    private async generateToken(user: Partial<IUser>) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }
}
