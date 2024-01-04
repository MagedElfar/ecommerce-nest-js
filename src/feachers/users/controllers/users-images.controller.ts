import { UsersImagesService } from '../services/users-images.service';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Express } from "express"
import { memoryStorage } from 'multer';
import { User } from 'src/core/decorators/user.decorator';
import { MediaSchema } from 'src/utility/swagger/schema/media.schema';
import { UploadImageDto } from '../dto/upload.dto';

@ApiTags("User Image")
@Controller('users-images')
@ApiBearerAuth()
export class UsersImagesController {

    constructor(private usersImagesService: UsersImagesService) { }

    @Post()
    @ApiOperation({ summary: "upload profile photo" })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ["file", "userId"],
            properties: {
                userId: { type: 'integer', description: "user id" },
                file: {
                    type: 'file',
                    description: "file to upload"
                },
            },
        },
    })
    @ApiCreatedResponse({
        type: MediaSchema
    })
    async upload(@UploadedFile() file: Express.Multer.File, @User("id") userId: number) {
        try {
            const image = await this.usersImagesService.upload({
                userId,
                file,
                folder: "users"
            })

            return image

        } catch (error) {
            throw error
        }
    }

}


