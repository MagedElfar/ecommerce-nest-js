import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsImageService } from '../services/products-images.service';
import { UploadImageDto } from '../dto/upload-image.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaDto } from 'src/feachers/media/dto/media.dto';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';

@ApiTags("Products")
@ApiBearerAuth()
@Controller('products/image')
export class ProductsImageController {
    constructor(private productsImageService: ProductsImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: "upload product cover image",
        description: `Role Required: ${UserRole.ADMIN}`
    })
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
