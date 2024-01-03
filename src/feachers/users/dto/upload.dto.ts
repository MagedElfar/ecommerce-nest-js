import { ApiProperty } from '@nestjs/swagger';
import { UploadMediaDto } from 'src/feachers/media/dto/uploadMedia.dto';

export class UploadImageDto extends UploadMediaDto {

    @ApiProperty({ description: "user id" })
    userId: number;

    @ApiProperty({
        description: 'File to upload',
        type: 'string',
        format: 'binary', // Specify the format as 'binary' for file uploads
    })
    file: Express.Multer.File
}