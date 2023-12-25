import { logger } from './core/logger/winston.config';
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from './feachers/users/user.entity';
import { UserImages } from './feachers/users-images/users-images.entity';
import { models } from './core/database/models';


@Injectable()
export class AppService {

  constructor(private sequelize: Sequelize) { }

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    // await this.dropAllForeignKeys()
    // this.sequelize.addModels(models)
    // await this.sequelize.sync({
    //   alter: true,
    //   force: true
    // })


    //   await this.sequelize.query(`
    //   ALTER TABLE products_sub_categories
    //   ADD CONSTRAINT subCategoryId_fk
    //   FOREIGN KEY (subCategoryId)
    //   REFERENCES seb_categories(id)
    //   ON DELETE CASCADE
    //   ON UPDATE CASCADE;
    // `)
    //   await this.sequelize.query(`
    //   ALTER TABLE products_sub_categories
    //   ADD CONSTRAINT productId_fk
    //   FOREIGN KEY (productId)
    //   REFERENCES products(id)
    //   ON DELETE CASCADE
    //   ON UPDATE CASCADE;
    // `)


  }

  private async dropAllForeignKeys() {
    const queryInterface = this.sequelize.getQueryInterface();

    // Get all tables in the database
    const tables = await queryInterface.showAllTables();

    // Get foreign keys for each table
    const foreignKeys = await queryInterface.getForeignKeysForTables(tables);

    // Iterate through the foreign keys and drop them
    for (const tableName of Object.keys(foreignKeys)) {
      for (const foreignKey of foreignKeys[tableName]) {
        try {
          await queryInterface.removeConstraint(tableName, foreignKey);
          // console.log(`Dropped foreign key ${foreignKey.constraintName} on ${tableName}`);
        } catch (error) {
          console.error(`Error dropping foreign key ${foreignKey.constraintName} on ${tableName}:`, error);
        }
      }
    }
  }

}
