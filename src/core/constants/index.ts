//ENUMS
export enum UserRole {
    ADMIN = 'admin',
    MANAGER = "manager",
    CUSTOMER = 'customer'
}

export enum OrderStatus {
    PADDING = "padding",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

export enum PaymentMethod {
    STRIPE = "stripe",
    CASH = "cash"
}

export enum PaymentStatus {
    SUCCUSS = "succuss",
    FAILED = "failed",
    PADDING = "padding",
}

//decorator
export const IS_PUBLIC_KEY = 'isPublic';

export const Permission_service = "permissionService"
//storage
export const CLOUDINARY = "CLOUDINARY"
export const USERFolder = "users"
export const CategoryFolder = "categories"
export const BrandsFolder = "brands"
export const ProductsFolder = "products"

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

