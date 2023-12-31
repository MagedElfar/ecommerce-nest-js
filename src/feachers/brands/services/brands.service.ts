import { MediaService } from 'src/feachers/media/media.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand } from '../brands.entity';
import * as slugify from "slugify"
import { IBrand } from '../brands.interface';
import { BrandQueryDto } from '../dto/brands-query.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateBrandDto } from '../dto/create-brands.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { Media } from 'src/feachers/media/media.entity';

@Injectable()
export class BrandsService {
    constructor(
        @InjectModel(Brand)
        private brandModel: typeof Brand,
        private sequelize: Sequelize,
        private readonly mediaService: MediaService

    ) { }

    async findAll(brandQueryDto: BrandQueryDto): Promise<IBrand[]> {
        try {
            const { limit, page, name } = brandQueryDto;

            const result = await this.brandModel.findAll({
                where: {
                    name: { [Op.like]: `%${name}%` },
                },
                include: [
                    {
                        model: Media,
                        attributes: ["id", "url"]
                    }
                ],
                limit,
                offset: (page - 1) * limit
            });

            const brands = result.map(item => item["dataValues"])

            return brands
        } catch (error) {
            throw error
        }
    }

    async getCount(brandQueryDto: BrandQueryDto): Promise<number> {
        try {

            const { limit, page, name } = brandQueryDto;

            const count = await this.brandModel.count({
                where: {
                    name: { [Op.like]: `%${name}%` },
                },
            });

            return count
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<IBrand | null> {
        try {
            const brand = await this.brandModel.findByPk(id, {
                include: [
                    {
                        model: Media,
                        attributes: ["id", "storageKey"]
                    }
                ],
            })

            if (!brand) return null;

            return brand["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<IBrand, "image">>): Promise<IBrand | null> {
        try {
            const brand = await this.brandModel.findOne({
                where: data,
                include: [
                    {
                        model: Media,
                        attributes: ["id", "url"]
                    },
                ],
            })

            if (!brand) return null;

            return brand["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async create(createBrandDto: CreateBrandDto): Promise<IBrand> {
        try {

            const slug: string = slugify.default(createBrandDto.name);

            const brand = await this.brandModel.create<Brand>({
                ...createBrandDto,
                slug
            })

            return brand["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('brand is already in exist');
            }

            throw error
        }
    }

    async update(id: number, updateBrandDto: UpdateBrandDto): Promise<IBrand> {
        try {

            let brand = await this.findOneById(id);

            if (!brand) throw new NotFoundException();

            const slug: string = slugify.default(updateBrandDto.name || brand.name);

            await this.brandModel.update<Brand>({
                ...updateBrandDto,
                slug
            }, { where: { id } })

            return {
                ...brand,
                ...updateBrandDto,
                slug
            }
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('brand is already in exist');
            }

            throw error
        }
    }

    async delete(id: number): Promise<void> {

        const t = await this.sequelize.transaction();

        try {

            const brand = await this.findOneById(id);

            if (!brand) throw new NotFoundException();

            const isDeleted = await this.brandModel.destroy({
                where: { id },
                transaction: t
            });

            if (!isDeleted) throw new NotFoundException();

            if (brand.imageId)
                await this.mediaService.delete(brand.imageId)

            t.commit()
            return;
        } catch (error) {
            t.rollback()
            throw error
        }
    }
}