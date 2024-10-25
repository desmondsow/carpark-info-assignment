import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserFavoriteCarpark = sequelize.define('UserFavoriteCarpark', {
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['UserId', 'CarparkId']
        }
    ]
});

export default UserFavoriteCarpark;
