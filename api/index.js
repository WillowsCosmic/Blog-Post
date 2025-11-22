import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import sequelize from "./utils/database.js";
import './models/associations.js';  
import AuthRoute from './routes/Auth.route.js';
import UserRoute from './routes/User.route.js';
import CategoryRoute from './routes/Category.route.js';
import fs from 'fs';
import BlogRoute from './routes/Blog.route.js';
import CommentRoute from './routes/Comment.route.js';
import Comment from './models/comment.model.js'

dotenv.config()

const uploadDir = './public/uploads/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Upload directory created');
}

const PORT = process.env.PORT
const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

// Routes
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRoute)

app.use('/public', express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

// ✅ Better sync with logging
sequelize.sync({ force: false }).then(() => {
    console.log("Database ready");
    console.log("Models loaded:", Object.keys(sequelize.models));
    
    app.listen(PORT, () => {
        console.log(`Server Running on port ${PORT}`);
    });
}).catch(error => {
    console.error("Database failed:", error);
});