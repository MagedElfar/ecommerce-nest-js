import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandsImageService } from '../services/brands-images.service';
import { UploadImageDto } from '../dto/upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('brands-images')
export class BrandsImageController {
    constructor(private brandsImageService: BrandsImageService) { }

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
            const image = await this.brandsImageService.upload({
                brandId: uploadImageDto.brandId,
                file
            })

            return { image }
        } catch (error) {
            throw error
        }
    }
}
