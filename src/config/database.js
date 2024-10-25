import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './db/db.sqlite',
    logging: process.env.DB_LOGGING === 'true'
});

export default sequelize;
