import { Product } from '../products/products.entity';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
    tableName: "media",
})
export class Media extends Model<Media> {
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


    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "image"
    })
    type: string
}
