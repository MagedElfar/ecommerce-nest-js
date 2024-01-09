import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandsImageService } from '../services/brands-images.service';
import { UploadImageDto } from '../dto/request/upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaDto } from 'src/feachers/media/dto/media.dto';

@ApiTags("Brands Images")
@Controller('brands-images')
@ApiBearerAuth()
export class BrandsImageController {
    constructor(private brandsImageService: BrandsImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    @ApiOperation({ summary: "upload brand image" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ["file", "brandId"],
            properties: {
                brandId: { type: 'integer', description: "brand id" },
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
            const image = await this.brandsImageService.upload({
                brandId: uploadImageDto.brandId,
                file
            })

            return image
        } catch (error) {
            throw error
        }
    }
}
