import { Express } from 'express';
export class UploadImageDto {
    userId: number;
    file: Express.Multer.File
}