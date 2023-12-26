import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Extend the CreateUserDto and exclude the password property
export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['variations', "subCategories", "userId"])) { }

