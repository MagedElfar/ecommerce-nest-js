import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadImageDto } from './dto/upload-image.dto';
import { ProductsVariationImageService } from './products-variations-images.service';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaDto } from '../media/dto/media.dto';

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
    @ApiOperation({ summary: "upload category image" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ["files", "variationId"],
            properties: {
                variationId: { type: 'integer', description: "variation id" },
                file: {
                    type: 'files',
                    description: "file to upload",
                    maxItems: 10
                },
            },
        },
    })
    @ApiCreatedResponse({
        type: MediaDto,
        isArray: true
    })
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

            return images
        } catch (error) {
            throw error
        }
    }
}
