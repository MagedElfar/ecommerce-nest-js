import { ApiProperty } from '@nestjs/swagger';
import { UploadMediaDto } from 'src/feachers/media/dto/uploadMedia.dto';

export class UploadImageDto extends UploadMediaDto {

    @ApiProperty({ description: "user id" })
    userId: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}