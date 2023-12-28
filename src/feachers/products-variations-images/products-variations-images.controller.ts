import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadProductVariationImageDto } from './dto/upload-variation-image.dto';
import { ProductsVariationImageService } from './products-variations-images.service';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('variations-images')
export class ProductsVariationsImageController {
    constructor(private productsVariationImageService: ProductsVariationImageService) { }

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: memoryStorage(),
        }),
    )
    async upload(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() uploadProductVariationImageDto: UploadProductVariationImageDto
    ) {
        try {
            console.log("files = ", files)

            const images = await Promise.all(files.map(
                async file => {
                    const image = await this.productsVariationImageService.create({
                        productVariationId: uploadProductVariationImageDto.productVariationId,
                        file
                    })

                    return image;
                })
            );

            return { images }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.productsVariationImageService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}
