import { Table, Column, Model, DataType, HasOne, BelongsTo, ForeignKey, HasMany, Scopes } from 'sequelize-typescript';
import { UserRole } from 'src/core/constants';
import { Cart } from '../carts/entities/carts.entity';
import { Media } from '../media/entities/media.entity';
import { Address } from '../addresses/entities/address.entity';
import { Phone } from '../phones/entities/phone.entity';

export enum UserScop {
    WITH_Media = "with details",
    WITH_PHONE = "with phone",
    WITH_ADDRESS = "with address",
    EXCLUDE_PASSWORD = 'exclude password'
}


@Scopes(() => ({
    [UserScop.EXCLUDE_PASSWORD]: {
        attributes: { exclude: ["password"] }
    },
    [UserScop.WITH_Media]: {
        include: [{
            model: Media,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }]
    },
    [UserScop.WITH_PHONE]: {
        include: [{
            model: Phone,
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"]
            }
        }]
    },
    [UserScop.WITH_ADDRESS]: {
        include: [{
            model: Address,
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"]
            }
        }]
    }
}))
@Table({
    tableName: "users",
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
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
        allowNull: true,
    })
    firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    lastName: string;

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
        defaultValue: UserRole.CUSTOMER
    })
    role: UserRole

    @ForeignKey(() => Media)
    @Column({ allowNull: true })
    imageId: number;

    @BelongsTo(() => Media, { onDelete: "SET NULL" })
    image: Media;

    @HasMany(() => Address)
    addresses: Address[]

    @HasMany(() => Phone)
    phones: Phone[]

    @HasOne(() => Cart)
    cart: Cart;
}

