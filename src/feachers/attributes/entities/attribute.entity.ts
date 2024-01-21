import { Column, DataType, HasMany, Model, Scopes, Sequelize, Table } from "sequelize-typescript";
import { AttributeValue } from "../../attributes-values/entities/attribute-value.entity";

export enum AttributeScopes {
    VALUE = "attribute value",
    VALUE_WITH_TOTAL = "attribute value with total"
}

@Scopes(() => ({
    [AttributeScopes.VALUE]: {
        include: [{
            model: AttributeValue,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }]
    },
    [AttributeScopes.VALUE_WITH_TOTAL]: {
        include: [{
            model: AttributeValue,

            attributes: [
                "id", "value",
                process.env.DB_DIALECT === "mysql" ?
                    [
                        Sequelize.literal(

                            '(SELECT COUNT(*) FROM products_variations_attributes WHERE products_variations_attributes.attrId = values.id)'
                        ),
                        'totalProducts'
                    ] :
                    [
                        Sequelize.literal('(SELECT COUNT(*) FROM "public"."products_variations_attributes" WHERE "public"."products_variations_attributes"."attrId" = "values"."id")'),
                        'totalProducts'
                    ]
            ],
        }]
    }
}))
@Table({
    tableName: "attributes",
    indexes: [
        {
            unique: true,
            fields: ["name"]
        }
    ]
})
export class Attribute extends Model<Attribute> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @HasMany(() => AttributeValue)
    values: AttributeValue[]
}