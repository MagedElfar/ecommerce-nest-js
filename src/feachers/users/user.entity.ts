import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from 'src/core/constants';
import { UserImages } from 'src/feachers/users-images/users-images.entity';

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

    @HasMany(() => UserImages)
    images: UserImages[];
}
