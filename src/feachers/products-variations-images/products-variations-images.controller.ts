import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadImageDto } from './dto/upload-image.dto';
import { ProductsVariationImageService } from './products-variations-images.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaDto } from '../media/dto/media.dto';
import { AssignImageDto } from './dto/assignImage.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';

@ApiTags("Products Variations")
@ApiBearerAuth()
@Controller('products-variations/images')
export class ProductsVariationsImageController {
    constructor(private productsVariationImageService: ProductsVariationImageService) { }

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: memoryStorage(),
        }),
    )
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "upload category image",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ["files", "variationId"],
            properties: {
                variationId: { type: 'integer', description: "variation id" },
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: "files to upload",
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

    @Post("assign")
    @ApiOperation({ summary: "assign exist image to specific product variation" })
    @ApiBody({ type: AssignImageDto })
    async assign(
        @Body() assignImageDto: AssignImageDto
    ) {
        try {
            return await this.productsVariationImageService.assign(assignImageDto)
        } catch (error) {
            throw error
        }
    }
}
