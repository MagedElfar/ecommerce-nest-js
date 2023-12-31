import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";
import { transformInt } from "src/core/pipes/parseInt.pipe";

export class UploadImageDto {
    @Transform((param) => transformInt(param))
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    subCategoryId: number

    file: Express.Multer.File;
}