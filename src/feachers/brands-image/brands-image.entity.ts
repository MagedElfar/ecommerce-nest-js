import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/feachers/users/user.entity';
import { Category } from '../categories/category.entity';
import { Brand } from '../brands/brands.entity';

@Table({ tableName: "brands_image" })
export class BrandImage extends Model<BrandImage> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    url: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    storageKey: string

    @ForeignKey(() => Brand)
    @Column
    brandId: number;

    @BelongsTo(() => Brand, { onDelete: "CASCADE" }) // Specify onDelete option here
    brand: Brand;

}
