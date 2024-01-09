import { PickType } from "@nestjs/swagger";
import { ProductDto } from "./product.dto";

export class FindProducts extends PickType(ProductDto, ["id", "name", "slug", "price", "description"]) { }