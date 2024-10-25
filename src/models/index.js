import sequelize from '../config/database.js';
import Carpark from './Carpark.js';
import CarParkType from './CarParkType.js';
import ParkingSystemType from './ParkingSystemType.js';
import User from './User.js';
import UserFavoriteCarpark from './UserFavoriteCarpark.js';
import { initializeAssociations } from './modelAssociations.js';

// Initialize all model associations
initializeAssociations();

// Database initialization function
export async function initDatabase() {
    try {
        await sequelize.sync({ force: true }); // This will drop all tables and recreate them
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Failed to sync database:', error);
        process.exit(1);
    }
}

export {
    sequelize,
    Carpark,
    CarParkType,
    ParkingSystemType,
    User,
    UserFavoriteCarpark
};
