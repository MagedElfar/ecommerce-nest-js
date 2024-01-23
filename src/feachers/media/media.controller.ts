import { MediaService } from 'src/feachers/media/media.service';
import { Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiFindAllResponse } from 'src/core/decorators/api-find-all-response.decorator';
import { MediaDto } from './dto/media.dto';
import { MediaQueryDto } from './dto/media.query.dto';

@ApiTags("Media")
@ApiBearerAuth()
@Controller('media')
export class MediaController {

    constructor(private readonly mediaService: MediaService) { }

    @Get()
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: "Find all media",
        description: `Required Role: ${UserRole.ADMIN}`
    })
    @ApiFindAllResponse(MediaDto)
    async get(@Query() mediaQueryDto: MediaQueryDto) {
        try {

            return await this.mediaService.findAll(mediaQueryDto);

        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: "get media by id",
        description: `Required Role: ${UserRole.ADMIN}`
    })
    @ApiParam({ name: "id", description: "media ID" })
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const media = this.mediaService.findById(id);

            if (!media) throw new NotFoundException("Media not found");

            return media
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: "delete media",
        description: `Required Role: ${UserRole.ADMIN}`
    })
    @ApiParam({ name: "id", description: "media ID" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.mediaService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}
