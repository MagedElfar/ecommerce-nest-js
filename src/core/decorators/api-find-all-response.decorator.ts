import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { FindAllDto } from "../dto/find-all.dto";

export const ApiFindAllResponse = <TModel extends Type<any>>(
    model: TModel,
) => {

    return applyDecorators(
        ApiExtraModels(FindAllDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(FindAllDto) },
                    {
                        properties: {
                            rows: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};