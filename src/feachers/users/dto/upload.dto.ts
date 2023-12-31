import { UploadMediaDto } from 'src/feachers/media/dto/uploadMedia.dto';

export class UploadImageDto extends UploadMediaDto {
    userId: number;
    file: Express.Multer.File
}