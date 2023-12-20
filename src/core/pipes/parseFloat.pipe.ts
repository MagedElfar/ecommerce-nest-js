import { TransformFnParams } from 'class-transformer';

export function transformFloat(param: TransformFnParams) {
    return parseFloat(param.value)
}
