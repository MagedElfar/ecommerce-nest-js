import { Category } from "src/feachers/categories/category.entity";
import { CategoryImage } from "src/feachers/category-image/category-image.entity";
import { UserImages } from "src/feachers/users-images/users-images.entity";
import { User } from "src/feachers/users/user.entity";

export const models = [
    User,
    UserImages,
    Category,
    CategoryImage
]