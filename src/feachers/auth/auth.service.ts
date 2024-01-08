import { LoginDto } from './dto/request/login.dto';
import { SignUpDto } from './dto/request/signup.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/feachers/users/users.interface';
import { UserScop } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
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
        const pass = await this.hashPassword(signUpDto.password);

        // create the user
        const newUser = await this.usersService.create({ ...signUpDto, password: pass });

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser;

        // generate token
        const token = await this.generateToken(result);

        // return the user and the token
        return { user: result, token };
    }


    async validateUser(loginDto: LoginDto) {
        try {
            const user = await this.usersService.findOne({ email: loginDto.email });

            if (!user) return null

            // find if user password match
            const match = await this.comparePassword(loginDto.password, user.password);

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

    private async hashPassword(password: string) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword: string, dbPassword: string) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

}
