import { ApiProperty } from "@nestjs/swagger";

export class UploadMediaDto {
    @ApiProperty({
        description: 'File to upload',
        type: 'string',
        format: 'binary', // Specify the format as 'binary' for file uploads
    })
    file: Express.Multer.File;
    folder: string
}