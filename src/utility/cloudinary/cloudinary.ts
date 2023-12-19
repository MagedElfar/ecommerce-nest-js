import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CLOUDINARY } from '../../core/constants';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: async (configService: ConfigService) => {
        return v2.config({
            cloud_name: configService.get("cloudStorage.cloudName"),
            api_key: configService.get("cloudStorage.apiKey"),
            api_secret: configService.get("cloudStorage.apiSecret"),
        });
    },
    inject: [ConfigService], // Inject the ConfigService

};