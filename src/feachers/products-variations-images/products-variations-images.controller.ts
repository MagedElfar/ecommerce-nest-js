import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadImageDto } from './dto/upload-image.dto';
import { ProductsVariationImageService } from './products-variations-images.service';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Products Variations Images")
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
        @Body() uploadImageDto: UploadImageDto
    ) {
        try {
            console.log("files = ", files)

            const images = await Promise.all(files.map(
                async file => {
                    const image = await this.productsVariationImageService.create({
                        variationId: uploadImageDto.variationId,
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
}
