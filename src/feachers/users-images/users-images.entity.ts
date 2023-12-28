import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/feachers/users/user.entity';

@Table({
    tableName: "users_images",
    indexes: [
        {
            unique: true,
            fields: ["userId"]
        }
    ]
})
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

    @BelongsTo(() => User, { onDelete: 'CASCADE' }) // Specify onDelete option here
    user: User;

}
