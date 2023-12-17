import { Request } from "express";

export class LoggerDto {
    message: string;
    req?: Request;
    statusCode?: number;
    logData?: any
}