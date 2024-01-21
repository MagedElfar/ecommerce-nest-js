import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/user.entity';

export enum UserScop {
    WITH_Media = "with details",
    WITH_PHONE = "with phone",
    WITH_ADDRESS = "with address",
    EXCLUDE_PASSWORD = 'exclude password'
}

@Table({
    tableName: "reset_tokens",
    indexes: [
        {
            unique: true,
            fields: ['token'],
        },
    ],
})
export class RestToken extends Model<RestToken> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    token: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    expireDate: Date;


    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, { onDelete: "CASCADE" })
    user: User;

}

