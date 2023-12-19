import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { UploadMediaDto } from 'src/core/dto/uploadMedia.dto';

export class UploadImageDto extends UploadMediaDto {
    userId: number;
}