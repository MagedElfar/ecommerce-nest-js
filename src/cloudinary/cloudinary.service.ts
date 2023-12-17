import { CloudinaryUploadDto } from './dto/cloudinaryUpload.dto';
import { LoggerService } from './../logger/logger.service';
import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudinaryService {

    constructor(private loggerService: LoggerService) { }

    async upload(cloudinaryUploadDto: CloudinaryUploadDto): Promise<UploadApiResponse | undefined> {
        const { file, folder } = cloudinaryUploadDto;
        const newFileName = `${uuidv4()}-${file.originalname}`; // Generate a new filename

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                public_id: `${folder}/${newFileName}`
            }, (error, result) => {
                if (error) {
                    this.loggerService.error("cloudinary error:", null, "", { error })
                    reject(error)
                    return;
                }
                result
                return resolve(result)
            }).end(file.buffer);
        })
    }


    // async delete(public_id: string) {
    //     try {
    //         await cloudinary.uploader.destroy(public_id)
    //     } catch (error) {
    //         this.logger.error("cloudinary error:", null, { error })
    //         throw error
    //     }
    // }
}
