import { UsersImagesService } from './users-images.service';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from "express"
import { memoryStorage } from 'multer';
import { User } from 'src/core/decorators/user.decorator';

@Controller('users-images')
export class UsersImagesController {

    constructor(private usersImagesService: UsersImagesService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async upload(@UploadedFile() file: Express.Multer.File, @User("id") userId: number) {
        try {
            const image = await this.usersImagesService.create({
                userId,
                file
            })

            return { image }

        } catch (error) {
            throw error
        }
    }

}
