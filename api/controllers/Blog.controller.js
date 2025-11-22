import { handleError } from "../helpers/handleError.js";
import bcrypt from "bcryptjs";

import { encode } from 'entities'
import { Blog, User, Category } from '../models/associations.js';

export const addBlog = async (req, res, next) => {
    try {

        const data = JSON.parse(req.body.data);


        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Featured image is required'
            });
        }


        const featuredImage = `/uploads/images/${req.file.filename}`;

        // ✅ Create blog using Sequelize (not MongoDB syntax)
        const blog = await Blog.create({
            author: data.author,
            category: data.category,
            title: data.title,
            slug: data.slug,
            featureImage: featuredImage,
            blogContent: encode(data.blogContent)
        });

        res.status(201).json({
            success: true,
            message: "Blog added successfully",
            data: blog
        });

    } catch (error) {
        console.error('Add blog error:', error);
        next(error);
    }
}
export const editBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const blog = await Blog.findByPk(blogid, {
            include: {
                model: Category,
                as: 'categoryData',
                attributes: ['id', 'name']
            }
        });
        if (!blog) {
            next(handleError(404, 'Data not found'));
        }
        res.status(200).json({
            blog
        });
    } catch (error) {
        next(handleError(500, error.message))
    }

}
export const updateBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const data = JSON.parse(req.body.data)

        const blog = await Blog.findByPk(blogid)

        if (!blog) {
            return next(handleError(404, 'Blog not found'))
        }

        blog.category = data.category
        blog.title = data.title
        blog.slug = data.slug
        blog.blogContent = encode(data.blogContent)

        if (req.file) {
            blog.featureImage = `/uploads/images/${req.file.filename}`
        }

        await blog.save()
        
        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
        })

    } catch (error) {
        console.error('Update blog error:', error)
        next(error)
    }
}
export const deleteBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params;

        const blog = await Blog.findByPk(blogid);

        if (blog) {
            await blog.destroy();
        }
        res.status(200).json({
            success: true,
            message: 'Blog delete successfully',
        });

    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const showAllBlog = async (req, res, next) => {
    try {
        const allBlog = await Blog.findAll({
            include: [
                {
                    model: User,
                    as: 'authorData',
                    attributes: ['id', 'name', 'role', 'avatar', 'email']
                },
                {
                    model: Category,
                    as: 'categoryData',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: allBlog.length,
            data: allBlog
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getBlog = async (req,res,next) => {
    try {
        const {slug} = req.params;
        const allBlog = await Blog.findOne({
            where: { slug },
            include: [
                {
                    model: User,
                    as: 'authorData',
                    attributes: ['id', 'name', 'role', 'avatar', 'email']
                },
                {
                    model: Category,
                    as: 'categoryData',
                    attributes: ['id', 'name', 'slug']
                }
            ]           
        });

        res.status(200).json({
            success: true,
            count: allBlog.length,
            data: allBlog
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}