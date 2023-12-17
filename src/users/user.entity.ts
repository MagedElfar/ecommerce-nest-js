import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from 'src/core/constants';
import { UserImages } from 'src/users-images/users-images.entity';

@Table({ tableName: "users" })
export class UserEntity extends Model<UserEntity> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
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

    @HasMany(() => UserImages)
    images: UserImages[];
}
