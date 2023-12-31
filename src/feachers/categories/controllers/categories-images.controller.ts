import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryImageService } from '../services/categories-images.service';
import { UploadImageDto } from './../dto/upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('categories-images')
export class CategoryImageController {
    constructor(private categoryImageService: CategoryImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadCategoryImageDto: UploadImageDto
    ) {
        try {
            const image = await this.categoryImageService.upload({
                categoryId: uploadCategoryImageDto.categoryId,
                file
            })

            return { image }
        } catch (error) {
            throw error
        }
    }
}
