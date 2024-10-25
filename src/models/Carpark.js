import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Carpark = sequelize.define('Carpark', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    car_park_no: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    address: DataTypes.STRING,
    x_coord: DataTypes.FLOAT,
    y_coord: DataTypes.FLOAT,
    short_term_parking: DataTypes.STRING,
    free_parking: DataTypes.STRING,
    night_parking: DataTypes.BOOLEAN,
    car_park_decks: DataTypes.INTEGER,
    gantry_height: DataTypes.FLOAT,
    car_park_basement: DataTypes.BOOLEAN
});

export default Carpark;
