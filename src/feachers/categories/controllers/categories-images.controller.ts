import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryImageService } from '../services/categories-images.service';
import { UploadImageDto } from '../dto/upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaDto } from 'src/feachers/media/dto/media.dto';

@ApiTags("Category")
@ApiBearerAuth()
@Controller('categories')
export class CategoryImageController {
    constructor(private categoryImageService: CategoryImageService) { }

    @Post("images")
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    @ApiOperation({ summary: "upload category image" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ["file", "categoryId"],
            properties: {
                categoryId: { type: 'integer', description: "category id" },
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
        @Body() uploadCategoryImageDto: UploadImageDto
    ) {
        try {
            const image = await this.categoryImageService.upload({
                categoryId: uploadCategoryImageDto.categoryId,
                file
            })

            return image
        } catch (error) {
            throw error
        }
    }
}
