//ENUMS
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    Vendor = "vendor"
}

export enum OrderStatus {
    PADDING = "padding",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

export enum PaymentMethod {
    CARD = "card",
    CASH = "cash"
}

export enum PaymentStatus {
    SUCCUSS = "succuss",
    FAILED = "failed",
    PADDING = "padding",
}

//decorator
export const IS_PUBLIC_KEY = 'isPublic';

//storage
export const CLOUDINARY = "CLOUDINARY"
export const USERFolder = "users"
export const CategoryFolder = "categories"
export const BrandsFolder = "brands"
export const ProductsFolder = "products"