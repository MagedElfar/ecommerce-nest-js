import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {

    private transporter: Transporter

    constructor(private readonly configService: ConfigService) {
        this.transporter = createTransport({
            service: "gmail",
            auth: {
                user: this.configService.get("nodemailer.user"),
                pass: this.configService.get("nodemailer.password")
            },
            tls: { rejectUnauthorized: false }
        })
    }

    async send(sendEmailDto: SendEmailDto): Promise<void> {


        try {
            await this.transporter.sendMail({
                from: "no-replay@gmail.com",
                ...sendEmailDto
            });

            return
        } catch (error) {
            throw error
        }

    }

}
