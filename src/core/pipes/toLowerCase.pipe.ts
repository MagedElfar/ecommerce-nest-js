import { TransformFnParams } from 'class-transformer';

export function transformLowerCase(param: TransformFnParams) {
    return param.value.toLowerCase()
}