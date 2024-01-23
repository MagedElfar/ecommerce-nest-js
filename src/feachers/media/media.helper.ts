import { Injectable } from "@nestjs/common";
import { WhereOptions, Op } from "sequelize";

@Injectable()
export class MediaHelper {
    buildDateRangeFilter(fromDate: string, toDate: string) {
        const where: WhereOptions = {};

        if (fromDate && toDate) {
            where.createdAt = {
                [Op.between]: [fromDate, toDate],
            };
        } else if (fromDate) {
            where.createdAt = {
                [Op.gte]: fromDate,
            };
        } else if (toDate) {
            where.createdAt = {
                [Op.lte]: toDate,
            };
        }

        return where
    }

}