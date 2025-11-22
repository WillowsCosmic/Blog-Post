import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Category = sequelize.define("category", {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [2, 100],
            notEmpty: true
        }
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        trim: true
    },
    
}, {
    tableName: "category",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    
});

export default Category;