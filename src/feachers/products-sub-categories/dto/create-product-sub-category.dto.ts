import { IsInt, IsNotEmpty } from "class-validator";

export class CreateProductSubCategoryDto {
    @IsNotEmpty()
    @IsInt()
    productId: number

    @IsNotEmpty()
    @IsInt()
    subCategoryId: number
}