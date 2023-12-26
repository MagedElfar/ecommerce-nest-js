import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductVariationDto } from './create-product-variations.dto';

// Extend the CreateUserDto and exclude the password property
export class UpdateProductVariationDto extends PartialType(OmitType(CreateProductVariationDto, ['attributes', "productId"])) { }

