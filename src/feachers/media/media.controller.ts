import { MediaService } from 'src/feachers/media/media.service';
import { Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags("Media")
@Controller('media')
export class MediaController {

    constructor(private readonly mediaService: MediaService) { }

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
