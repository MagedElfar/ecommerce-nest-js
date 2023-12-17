import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserEntity as User } from 'src/users/user.entity';

@Table
export class UserImages extends Model<UserImages> {
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

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

}
