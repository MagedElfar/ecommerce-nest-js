import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsImageService } from '../services/products-images.service';
import { UploadImageDto } from '../dto/upload-image.dto';

@Controller('products-images')
export class ProductsImageController {
    constructor(private productsImageService: ProductsImageService) { }

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
            const image = await this.productsImageService.upload({
                productId: uploadImageDto.productId,
                file
            })

            return { image }
        } catch (error) {
            throw error
        }
    }
}
