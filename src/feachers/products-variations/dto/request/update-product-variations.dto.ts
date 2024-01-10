import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductVariationDto } from './create-product-variations.dto';

// Extend the CreateUserDto and exclude the password property
export class UpdateProductVariationDto extends PartialType(OmitType(CreateProductVariationDto, ['attributes', "productId"])) { }

