import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";
import { UploadMediaDto } from "src/core/dto/uploadMedia.dto";
import { transformInt } from "src/core/pipes/parseInt.pipe";

export class UploadCategoryImageDto extends UploadMediaDto {
    @Transform((param) => transformInt(param))
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    categoryId: number
}