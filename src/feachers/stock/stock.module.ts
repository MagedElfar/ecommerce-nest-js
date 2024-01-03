import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { ProductVariationsModule } from '../products-variations/products-variations.module';

@Module({
  imports: [ProductVariationsModule],
  providers: [StockService],
  exports: [StockService]
})
export class StockModule { }
