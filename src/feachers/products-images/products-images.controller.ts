import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsImageService } from './products-images.service';
import { UploadProductImageDto } from './dto/upload-product-image.dto';

@Controller('products-images')
export class ProductsController {
    constructor(private productsImageService: ProductsImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadProductImageDto: UploadProductImageDto
    ) {
        try {

            const image = await this.productsImageService.create({
                productId: uploadProductImageDto.productId,
                file
            })

            return { image }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.productsImageService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}
