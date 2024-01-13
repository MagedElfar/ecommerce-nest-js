import { Column, DataType, HasMany, Model, Scopes, Sequelize, Table } from "sequelize-typescript";
import { AttributeValues } from "../attributes-values/attributes-values.entity";
import { ConfigService } from "@nestjs/config";
import { col, fn } from "sequelize";
import { ProductVariationAttribute } from "../products-variations-attributes/products-variations-attributes.entity";

export enum AttributeScopes {
    VALUE = "attribute value",
    VALUE_WITH_TOTAL = "attribute value with total"
}

@Scopes(() => ({
    [AttributeScopes.VALUE]: {
        include: [{
            model: AttributeValues,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }]
    },
    [AttributeScopes.VALUE_WITH_TOTAL]: {
        include: [{
            model: AttributeValues,

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

    @HasMany(() => AttributeValues)
    values: AttributeValues[]
}