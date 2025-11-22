import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";


const Comment = sequelize.define("comment", {
    author:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',  
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    },
    blogid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'blogs',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    
}, {
    tableName: "comments",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});



export default Comment;