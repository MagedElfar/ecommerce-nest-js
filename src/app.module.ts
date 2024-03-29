import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './feachers/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './feachers/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './feachers/auth/guards/jwt-auth.guard';
import configuration from './core/config/configuration';
import { LoggerModule } from './core/logger/logger.module';
import { LoggerMiddleware } from './core/logger/logger.middleware';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { RolesGuard } from './core/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CloudinaryModule } from './utility/cloudinary/cloudinary.module';
import { CategoriesModule } from './feachers/categories/categories.module';
import { BrandsModule } from './feachers/brands/brands.module';
import { ProductsModule } from './feachers/products/products.module';
import { AttributesModule } from './feachers/attributes/attributes.module';
import { SubCategoriesModule } from './feachers/sub-categories/sub-categories.module';
import { ProductsSubCategoriesModule } from './feachers/products-sub-categories/products-sub-categories.module';
import { AttributeValuesModule } from './feachers/attributes-values/attributes-values.module';
import { ProductVariationAttributesModule } from './feachers/products-variations-attributes/products-variations-attributes.module';
import { ProductVariationsModule } from './feachers/products-variations/products-variations.module';
import { CategoriesAttributesModule } from './feachers/categories-attributes/categories-attributes.module';
import { CartsModule } from './feachers/carts/carts.module';
import { CartItemsModule } from './feachers/cart-items/cart-items.module';
import { MediaModule } from './feachers/media/media.module';
import { ProductsVariationImageModule } from './feachers/products-variations-images/products-variations-images.module';
import { AddressesModule } from './feachers/addresses/addresses.module';
import { PhonesModule } from './feachers/phones/phones.module';
import { OrdersModule } from './feachers/orders/orders.module';
import { PaymentsModule } from './feachers/payments/payments.module';
import { OrdersItemsModule } from './feachers/orders-items/orders-items.module';
import { PaymentsMethodsModule } from './feachers/payments-methods/payments-method.module';
import { OrdersCancelReasonsModule } from './feachers/orders-cancel-reasons/orders-cancel-reasons.module';
import { StripeModule } from './utility/stripe/stripe.module';
import { CheckoutModule } from './feachers/checkout/checkout.module';
import { RawBodyMiddleware } from './core/middleware/raw-body.middleware';
import { StockModule } from './feachers/stock/stock.module';
import { CategoriesBrandsModule } from './feachers/categories-brands/categories-brands.module';
import { PaymentStrategyModule } from './utility/payment-strategy/payment-strategy.module';
import { DatabaseModule } from './core/database/database.module';
import { MailModule } from './utility/mail/mail.module';
import { InjectUserInterceptor } from './core/interceptors/inject-user.interceptor';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 1000,
      limit: 3,

    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    DatabaseModule,
    LoggerModule,
    CloudinaryModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    SubCategoriesModule,
    BrandsModule,
    ProductsModule,
    AttributesModule,
    AttributeValuesModule,
    ProductVariationsModule,
    ProductsVariationImageModule,
    ProductsSubCategoriesModule,
    ProductVariationAttributesModule,
    CategoriesAttributesModule,
    CartsModule,
    CartItemsModule,
    MediaModule,
    AddressesModule,
    PhonesModule,
    OrdersModule,
    PaymentsMethodsModule,
    PaymentsModule,
    OrdersItemsModule,
    OrdersCancelReasonsModule,
    StripeModule,
    CheckoutModule,
    StockModule,
    CategoriesBrandsModule,
    PaymentStrategyModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },


    AppService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(RawBodyMiddleware).forRoutes("stripe")
  }
}
