import Carpark from './Carpark.js';
import CarParkType from './CarParkType.js';
import ParkingSystemType from './ParkingSystemType.js';
import User from './User.js';
import UserFavoriteCarpark from './UserFavoriteCarpark.js';

export function initializeAssociations() {
    // Carpark associations
    Carpark.belongsTo(CarParkType, { foreignKey: 'carParkTypeId' });
    Carpark.belongsTo(ParkingSystemType, { foreignKey: 'parkingSystemTypeId' });

    // User-Carpark many-to-many relationship
    User.belongsToMany(Carpark, {
        through: UserFavoriteCarpark,
        as: 'favorites',
        foreignKey: {
            name: 'UserId',
            allowNull: false
        }
    });

    Carpark.belongsToMany(User, {
        through: UserFavoriteCarpark,
        as: 'favoritedBy',
        foreignKey: {
            name: 'CarparkId',
            allowNull: false
        }
    });
}
