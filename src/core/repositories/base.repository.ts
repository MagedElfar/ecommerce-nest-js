import { Model, FindOptions, ModelStatic, CreationAttributes, WhereOptions } from 'sequelize';

interface IReadRecord<T> {
    scope?: string[],
    where?: WhereOptions<T>,
    options?: FindOptions
}

export abstract class BaseRepository<T extends Model> {
    private readonly model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async findAndCountAll({ where, scope = [], options }: IReadRecord<T>): Promise<any> {
        try {

            const { limit, offset, ...rest } = options

            console.log(rest)

            return await this.model.scope(scope).findAndCountAll({
                where,
                limit,
                offset: (offset - 1) * limit,
                ...rest
            });
        } catch (error) {
            throw error
        }
    }

    async findAll({ where, scope = [], options }: IReadRecord<T>): Promise<T[]> {
        try {

            const { limit, offset, ...rest } = options
            return await this.model.scope(scope).findAll({
                where,
                limit,
                offset: (offset - 1) * limit,
                ...rest
            });
        } catch (error) {
            throw error
        }
    }

    async countAll({ where }: IReadRecord<T>): Promise<number> {
        try {
            return await this.model.count({ where });
        } catch (error) {
            throw error
        }
    }

    async findById(id: number, scope = []): Promise<T | null> {
        try {
            const data = await this.model.scope(scope).findByPk(id);

            if (!data) return null

            return data["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne({ where, scope = [], options }: IReadRecord<T>): Promise<T | null> {
        try {
            const data = await this.model.scope(scope).findOne({
                where,
                ...options
            });

            if (!data) return null

            return data["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async create(entity: Partial<CreationAttributes<T>>, options?: FindOptions): Promise<T> {
        try {
            const data = await this.model.create(entity as any, options);

            return data["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, entity: Partial<T>, options?: FindOptions): Promise<number> {

        try {

            const [affectedRowsCount] = await this.model.update(entity, { where: { id }, ...options });

            return affectedRowsCount
        } catch (error) {
            throw error
        }

    }

    async delete(id: number, options?: FindOptions): Promise<number> {
        try {
            const result = await this.model.destroy({ where: { id }, ...options });
            return result;
        } catch (error) {
            error
        }
    }
}
