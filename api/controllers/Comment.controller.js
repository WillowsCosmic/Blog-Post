import { handleError } from "../helpers/handleError.js"
import Comment from "../models/comment.model.js"

export const addcomment = async(req, res, next) => {
    try {
        const { author, blogid, comment } = req.body
        
        const newComment = await Comment.create({
            author: author,
            blogid: blogid,
            comment: comment
        })
        
        res.status(200).json({
            success: true,
            message: 'Comment submitted',
            comment: newComment
        })
        
    } catch (error) {
        next(handleError(500, error.message))
    }
}