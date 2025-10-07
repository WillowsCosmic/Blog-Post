import jwt from "jsonwebtoken";
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        // console.log("File uploaded:", req.fiOnele ? "Yes" : "No");
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            next(handleError(409, 'User Already registered'))
        }
        
        const hashedPassword = bcrypt.hashSync(password, 10);

        // // Handle profile picture upload
        // let profilePhoto = null;
        // if (req.file) {
        //     // If using disk storage (recommended)
        //     if (req.file.filename) {
        //         profilePhoto = `/public/uploads/images/${req.file.filename}`;
        //     }
        //     // If using memory storage
        //     else if (req.file.buffer) {
        //         // You'd need to save the buffer to disk here
        //         console.log("File received in memory, size:", req.file.buffer.length);
        //     }
        // }

        await User.create({
            name,
            email,
            password: hashedPassword,
        });


        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        next(handleError(500,error.message))
    }
};

export const login = async (req, res,next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user){
            next(handleError(404, 'Invalid Login Credentials'))
        }
        const hashedPassword = user.password

        const comparePassword = bcrypt.compare(password, hashedPassword)

        if(!comparePassword){
            next(handleError(404, 'Invalid Login Credentials'))
        }


        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar:user.avatar
        },process.env.JWT_SECRET);

        res.cookie('access_token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            path: '/'
        })

        res.status(200).json({
            success:true,
            user,
            message: 'Login Successful'
        })

    } catch (error) {
        next(handleError(500,error.message))
    }
};
export const logout = async (req, res,next) => {
    try {
        res.clearCookie('access_token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            path: '/'
        })

        res.status(200).json({
            success:true,
            message: 'Logout Successful'
        })

    } catch (error) {
        next(handleError(500,error.message))
    }
};

export const GoogleLogin = async (req, res,next) => {
    try {
        const { name,email,avatar } = req.body;
        let user
        user = await User.findOne({ where: { email } });
        if (!user){
            const password = Math.random().toString()
            const hashedPassword = bcrypt.hashSync(password)
            const newUser = new User({
                name, email,password: hashedPassword,avatar
            })
            await newUser.save()
        }
        

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar:user.avatar
        },process.env.JWT_SECRET);

        res.cookie('access_token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            path: '/'
        })

        res.status(200).json({
            success:true,
            user,
            message: 'Login Successful'
        })

    } catch (error) {
        next(handleError(500,error.message))
    }
};

