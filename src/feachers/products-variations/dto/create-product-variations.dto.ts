import { PartialType, OmitType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsNotEmpty, Min, IsInt, IsString, ValidateNested, IsOptional, IsArray, ArrayMinSize, ValidatorConstraintInterface } from "class-validator"
import { CreateProductAttributesDto } from "src/feachers/products-variations-attributes/dto/create-product_variation_attributes.dto";

// Custom validator for nested array elements
const validateAttributes: any = (attributes: CreateProductAttributesDto[]) => {
    if (!attributes) return true; // Allow empty arrays
    for (const attribute of attributes) {
        // Perform specific validation checks on each attribute
        if (!attribute.attrId) {
            throw new Error('Invalid attribute: name and value are required');
        }
    }
    return true;
};

export class CreateProductVariationDto {

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    quantity: number

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    productId: number

    @IsNotEmpty()
    @IsString()
    sku: string

    @IsOptional()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreateProductAttributesDto, ['productVariationId'])))
    attributes?: CreateProductAttributesDto[]
}