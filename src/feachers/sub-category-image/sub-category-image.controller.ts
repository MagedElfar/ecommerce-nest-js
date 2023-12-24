import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SubCategoryImageService } from './sub-category-image.service';
import { UploadCategoryImageDto } from './dto/uploadCategoryImage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('sub-category-image')
export class SubCategoryImageController {
    constructor(private subCategoryImageService: SubCategoryImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadCategoryImageDto: UploadCategoryImageDto
    ) {
        try {
            const image = await this.subCategoryImageService.create({
                categoryId: uploadCategoryImageDto.categoryId,
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
            await this.subCategoryImageService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}
