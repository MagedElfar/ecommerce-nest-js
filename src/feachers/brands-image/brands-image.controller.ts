import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BrandImageService } from './brands-image.service';
import { UploadBrandImageDto } from './dto/uploadBrandImage.dto';

@Controller('brand-image')
export class BrandsImageController {
    constructor(private brandImageService: BrandImageService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadBrandImageDto: UploadBrandImageDto
    ) {
        try {
            const image = await this.brandImageService.create({
                brandId: uploadBrandImageDto.brandId,
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
            await this.brandImageService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}
