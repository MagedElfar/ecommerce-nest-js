import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SubCategoryImageService } from '../services/sub-categories-images.service';
import { UploadImageDto } from '../dto/upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('sub-categories-images')
export class SubCategoryImageController {
    constructor(private subCategoryImageService: SubCategoryImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadImageDto: UploadImageDto
    ) {
        try {
            const image = await this.subCategoryImageService.upload({
                subCategoryId: uploadImageDto.subCategoryId,
                file
            })

            return { image }
        } catch (error) {
            throw error
        }
    }
}
