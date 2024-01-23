import { Model, FindOptions, ModelStatic, CreationAttributes } from 'sequelize';

export abstract class BaseRepository<T extends Model> {
    private readonly model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async findAll(scope: string[] = [], options?: FindOptions): Promise<T[]> {
        try {

            const { limit, offset } = options
            return await this.model.scope(scope).findAll({
                limit,
                offset: (offset - 1) * limit,
                ...options
            });
        } catch (error) {
            throw error
        }
    }

    async findById(id: number, scope: string[] = [], options?: FindOptions): Promise<T | null> {
        try {
            return await this.model.scope(scope).findByPk(id, options);
        } catch (error) {
            throw error
        }
    }

    async create(entity: Partial<CreationAttributes<T>>, options?: FindOptions): Promise<T> {
        try {
            return await this.model.create(entity as any, options);
        } catch (error) {
            throw error
        }
    }

    async update(id: number, entity: Partial<T>, options?: FindOptions): Promise<T | null> {

        try {
            await this.model.update(entity, { where: { id }, ...options });
            return this.findById(id, []);
        } catch (error) {
            throw error
        }

    }

    async delete(id: number, options?: FindOptions): Promise<number> {
        const result = await this.model.destroy({ where: { id }, ...options });
        return result;
    }
}
