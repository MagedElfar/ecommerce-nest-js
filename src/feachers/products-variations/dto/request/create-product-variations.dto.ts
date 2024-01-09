import { OmitType } from "@nestjs/swagger"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer"
import { IsNotEmpty, Min, IsInt, IsString, ValidateNested, IsOptional, IsArray, ArrayMinSize, ValidatorConstraintInterface, IsNumber } from "class-validator"
import { CreateProductAttributesDto } from "src/feachers/products-variations-attributes/dto/request/create-product_variation_attributes.dto";

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

class CreateProductAttributesDtoOmitted extends OmitType(CreateProductAttributesDto, ['productVariationId']) { }

export class CreateProductVariationDto {

    @ApiProperty({
        description: "variation quantity",
        example: 10
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    quantity: number

    @ApiProperty({
        description: "product id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    productId: number

    @ApiProperty({
        description: "variation ske",
        example: "SKU-EX-01"
    })
    @IsNotEmpty()
    @IsString()
    sku: string

    @ApiPropertyOptional({
        description: "variation name",
        example: "variation name"
    })
    @IsOptional()
    @IsString()
    name: string

    @ApiPropertyOptional({
        description: "variation price",
        example: 10
    })
    @IsOptional()
    @IsNumber()
    price: number

    @ApiPropertyOptional({
        description: "variation attributes",
        isArray: true,
        type: CreateProductAttributesDtoOmitted
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => OmitType(CreateProductAttributesDto, ['productVariationId']))
    attributes: CreateProductAttributesDto[]
}