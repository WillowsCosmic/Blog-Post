import express from 'express'
import { addBlog, deleteBlog, editBlog, getBlog, showAllBlog, updateBlog } from '../controllers/Blog.controller.js'
import { featuredImageUpload } from '../middlewares/multer.js'


const BlogRoute = express.Router()

BlogRoute.post('/add',featuredImageUpload, addBlog)
BlogRoute.get('/edit/:blogid',editBlog)
BlogRoute.put('/update/:blogid',featuredImageUpload,updateBlog)
BlogRoute.delete('/delete/:blogid',deleteBlog)
BlogRoute.get('/get-all',showAllBlog)
BlogRoute.get('/get-blog/:slug',getBlog)


export default BlogRoute