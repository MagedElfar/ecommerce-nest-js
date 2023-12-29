import { IsInt, IsNotEmpty } from "class-validator";

export class CreateCategoryAttributesDto {
    @IsNotEmpty()
    @IsInt()
    categoryId: number

    @IsNotEmpty()
    @IsInt()
    attributeId: number
}