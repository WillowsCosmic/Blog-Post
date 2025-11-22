import jwt from "jsonwebtoken";
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Category from "../models/category.model.js";

export const addCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body
        const category = new Category({
            name, slug
        })
        await category.save()
        res.status(200).json({
            success: true,
            message: 'Category added successfully'
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const showCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params
        const categories = await Category.findByPk(categoryid);
        if (!categories) {
            next(handleError(404, 'Data not found'));
        }
        res.status(200).json({
            categories
        });
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const updateCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body;
        const { categoryid } = req.params;  
        
        const category = await Category.findByPk(categoryid);
        
        if (!category) {
            return next(handleError(404, 'Category not found'));
        }
        
        await category.update({ name, slug });
        
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category  
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}
export const deleteCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params;  
        
        const category = await Category.findByPk(categoryid);
        
        if (category) {
            await category.destroy();
        }
        res.status(200).json({
            success: true,
            message: 'Category delete successfully',  
        });
        
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getAllCategory = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            order: [['createdAt', 'ASC']],
            raw: true
        });
        res.status(200).json({
            categories
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};