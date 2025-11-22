import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";


const Blog = sequelize.define("blog", {
    author:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',  
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' 
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    blogContent: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    featureImage:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: "blogs",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});



export default Blog;