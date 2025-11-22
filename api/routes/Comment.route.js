import express from 'express'
import { addcomment } from '../controllers/Comment.controller.js'



const CommentRoute = express.Router()


CommentRoute.post('/add',addcomment)


export default CommentRoute