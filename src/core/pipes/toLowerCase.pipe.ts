import { TransformFnParams } from 'class-transformer';

export function transformLowerCase(param: TransformFnParams) {
    if (typeof (param.value) !== "string") return;
    return param.value.toLowerCase().trim()
}