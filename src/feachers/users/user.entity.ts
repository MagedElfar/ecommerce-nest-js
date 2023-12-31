import { Table, Column, Model, DataType, HasOne, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UserRole } from 'src/core/constants';
import { Cart } from '../carts/carts.entity';
import { Media } from '../media/media.entity';

@Table({
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
        // Add other indexes as needed
    ],
})
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.USER
    })
    role: UserRole

    @ForeignKey(() => Media)
    @Column({ allowNull: true })
    imageId: number;

    @BelongsTo(() => Media, { onDelete: "SET NULL" })
    image: Media;

    @HasOne(() => Cart)
    cart: Cart;
}
