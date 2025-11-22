import sequelize from "../utils/database.js";
import User from "./user.model.js";
import Category from "./category.model.js";
import Blog from "./blog.model.js";


Blog.belongsTo(Category, {
    foreignKey: 'category',
    as: 'categoryData'
});

Blog.belongsTo(User, {
    foreignKey: 'author',
    as: 'authorData'
});

Category.hasMany(Blog, {
    foreignKey: 'category',
    as: 'blogs'
});

User.hasMany(Blog, {
    foreignKey: 'author',
    as: 'blogs'
});

export { sequelize, User, Category, Blog };