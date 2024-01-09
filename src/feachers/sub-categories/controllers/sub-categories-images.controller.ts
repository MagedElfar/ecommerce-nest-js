import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SubCategoryImageService } from '../services/sub-categories-images.service';
import { UploadImageDto } from '../dto/request/upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaDto } from 'src/feachers/media/dto/media.dto';

@ApiTags("Sub category Image")
@ApiBearerAuth()
@Controller('sub-categories-images')
export class SubCategoryImageController {
    constructor(private subCategoryImageService: SubCategoryImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    @ApiOperation({ summary: "upload sub category image" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ["file", "subCategoryId"],
            properties: {
                subCategoryId: { type: 'integer', description: "subCategory id" },
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
            const image = await this.subCategoryImageService.upload({
                subCategoryId: uploadImageDto.subCategoryId,
                file
            })

            return image
        } catch (error) {
            throw error
        }
    }
}
