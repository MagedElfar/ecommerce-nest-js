import { Express } from 'express';

export class CloudinaryUploadDto {
    folder: string;
    file: Express.Multer.File
}