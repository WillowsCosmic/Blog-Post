import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
        validate: {
            isIn: [['user', 'admin']]
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [2, 100],
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: [0, 500]
        }
    },
    avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
        
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: /^[\+]?[1-9][\d]{0,15}$/
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true,  // ✅ Changed to true
        validate: {
            len: {
                args: [6, 255],
                msg: "Password must be between 6 and 255 characters"
            },
            // ✅ Custom validation for regular vs Google signup
            isValidPassword(value) {
                // If no avatar (regular signup), password is required
                if (!this.avatar && (!value || value.length === 0)) {
                    throw new Error('Password is required for email signup');
                }
            }
        }
    }
}, {
    tableName: "users",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

export default User;