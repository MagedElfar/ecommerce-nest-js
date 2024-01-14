import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// Extend the CreateUserDto and exclude the password property
export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['variations', "subCategories", "userId"])) {
    imageId?: number
}

