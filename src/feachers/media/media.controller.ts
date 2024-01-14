import { MediaService } from 'src/feachers/media/media.service';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { MediaDto } from './dto/media.dto';
import { MediaQueryDto } from './dto/media.query.dto';

@ApiTags("Media")
@ApiBearerAuth()
@Controller('media')
export class MediaController {

    constructor(private readonly mediaService: MediaService) { }

    @Get()
    @Roles([UserRole.ADMIN])
    @ApiFindAllResponse(MediaDto)
    async get(@Query() mediaQueryDto: MediaQueryDto) {
        try {
            return await this.mediaService.findAll(mediaQueryDto);

        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "delete media" })
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
