import { MailService } from '../../../utility/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RestToken } from '../entities/reset-token.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { SendForgetPasswordEmailDto } from '../dto/forget-password-email.dto';
import * as crypto from 'crypto';
import * as moment from 'moment';
import { Sequelize } from 'sequelize-typescript';
import { ForgetPasswordRestDto } from '../dto/forget-password-rest.dto';

@Injectable()
export class PasswordService {

    constructor(
        @InjectModel(RestToken) private readonly restTokenModel: typeof RestToken,
        private readonly userServices: UsersService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly sequelize: Sequelize,
    ) { }


    private async changePassword(userId: number, newPassword: string) {
        try {
            const password = await this.hashPassword(newPassword)

            await this.userServices.update(userId, { password });

            return
        } catch (error) {
            throw error
        }
    }

    async forgetPasswordRest(forgetPasswordRestDto: ForgetPasswordRestDto) {
        const { token, email, password, confirmPassword } = forgetPasswordRestDto

        try {

            const restToken = await this.restTokenModel.findOne({
                where: { email, token }
            })

            if (!restToken || moment().isAfter(restToken.expireDate)) throw new BadRequestException("Invalid or expired token.")


            await this.changePassword(restToken.userId, password)
        } catch (error) {
            throw error
        } finally {
            await this.restTokenModel.destroy({ where: { token } })
        }
    }

    async sendForgetPasswordEmail(sendForgetPasswordEmailDto: SendForgetPasswordEmailDto) {
        const transaction = await this.sequelize.transaction()
        try {

            const { email } = sendForgetPasswordEmailDto
            const user = await this.userServices.findOne({ email })

            if (!user) throw new NotFoundException("user not found");

            const token = crypto.randomBytes(20).toString('hex');

            console.log("token = ", token)

            const expireDate = moment().add(15, 'minutes').toDate();

            await this.restTokenModel.create({
                token,
                userId: user.id,
                email,
                expireDate
            }, { transaction })

            await this.mailService.send({
                to: email,
                subject: "Forget Password",
                html: `
                <h3 style="color:red;">Please click on the link blow to rest your password</h3>
                <a href = "${this.configService.get("uiLink")}/forgot-password?token=${token}">Rest Password</a>
                <p style="font-size:16px;">this link valid for 15 minutes for one time use</p>
                `
            })

            await transaction.commit()

            return
        } catch (error) {

            await transaction.rollback()
            throw error
        }
    }

    async hashPassword(password: string) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async comparePassword(enteredPassword: string, dbPassword: string) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}
