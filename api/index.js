import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import sequelize from "./utils/database.js";
import AuthRoute from './routes/Auth.route.js';

dotenv.config()

const PORT = process.env.PORT
const app = express()

app.use(cookieParser()) //Data parsed with cookies
app.use(express.json()) //json data is sent from frontent api to backend

//cors is used to allow cross origin request and establish connection b/w frontend and backend
 
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true //to get the cookies
}))

// route setup
app.use('/api/auth',AuthRoute)

//Middleware to receive the error from the error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

sequelize.sync().then(() => {
    console.log("Database ready");
    app.listen(PORT, () => {
        console.log(`Server Running on port`,PORT);
    });
}).catch(error => {
    console.error("Database failed:", error);
});