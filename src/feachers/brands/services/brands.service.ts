import { MediaService } from 'src/feachers/media/media.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand, BrandScope } from '../brands.entity';
import * as slugify from "slugify"
import { IBrand } from '../brands.interface';
import { BrandQueryDto } from '../dto/request/brands-query.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateBrandDto } from '../dto/request/create-brands.dto';
import { UpdateBrandDto } from '../dto/request/update-brand.dto';

@Injectable()
export class BrandsService {
    constructor(
        @InjectModel(Brand)
        private brandModel: typeof Brand,
        private sequelize: Sequelize,
        private readonly mediaService: MediaService

    ) { }

    async findAll(brandQueryDto: BrandQueryDto, scopes: any[] = []): Promise<any> {
        try {
            const { limit, page, name } = brandQueryDto;

            const brands = await this.brandModel.scope(scopes).findAndCountAll({
                where: {
                    name: { [Op.iLike]: `%${name}%` },
                },
                limit,
                offset: (page - 1) * limit
            });

            return brands
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number, scopes: any[] = []): Promise<IBrand | null> {
        try {
            const brand = await this.brandModel.scope(scopes).findByPk(id)

            if (!brand) return null;

            return brand["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<IBrand, "image">>, scopes: any[] = []): Promise<IBrand | null> {
        try {
            const brand = await this.brandModel.scope(scopes).findOne({
                where: data,
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

            return this.findOneById(id, [BrandScope.WITH_IMAGE])
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
                await this.mediaService.delete(brand.imageId, t)

            await t.commit()
            return;
        } catch (error) {
            await t.rollback()
            throw error
        }
    }
}
