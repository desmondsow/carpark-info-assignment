import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CarParkType = sequelize.define('CarParkType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

export default CarParkType;
