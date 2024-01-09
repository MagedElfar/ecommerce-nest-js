import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsImageService } from '../services/products-images.service';
import { UploadImageDto } from '../dto/request/upload-image.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaDto } from 'src/feachers/media/dto/media.dto';

@ApiTags("Product Image")
@ApiBearerAuth()
@Controller('products-images')
export class ProductsImageController {
    constructor(private productsImageService: ProductsImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    @ApiOperation({ summary: "upload product cover image" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ["file", "productId"],
            properties: {
                productId: { type: 'integer', description: "product id" },
                file: {
                    type: 'file',
                    description: "file to upload"
                },
            },
        },
    })
    @ApiCreatedResponse({
        type: MediaDto
    })
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadImageDto: UploadImageDto
    ) {
        try {
            const image = await this.productsImageService.upload({
                productId: uploadImageDto.productId,
                file
            })

            return image
        } catch (error) {
            throw error
        }
    }
}
