import { TransformFnParams } from 'class-transformer';

export function transformInt(param: TransformFnParams) {
    return parseInt(param.value, 10)
}
