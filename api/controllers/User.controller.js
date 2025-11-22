import jwt from "jsonwebtoken";
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUser = async (req, res, next) => {  
    try {
        const { userid } = req.params  
        
        const user = await User.findByPk(userid)
        
        if (!user) {
            return next(handleError(404, 'User not found'))  
        }
        
        console.log('🔍 Found user:', {
            id: user.id,
            name: user.name,
            avatar: user.avatar
        });
        
        res.status(200).json({
            success: true,
            message: 'User data found',
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
                bio: user.bio || '',
                avatar: user.avatar || ''
            }
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const updateUser = async (req, res, next) => {
    try {
        console.log('📝 Request body:', req.body);
        console.log('📁 Request file:', req.file);
        
        const { userid } = req.params;
        const { name, email, bio, password } = req.body;
        
        const user = await User.findByPk(userid);
        
        if (!user) {
            return next(handleError(404, 'User not found'));
        }
        
        const updateData = {};
        
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (bio !== undefined) updateData.bio = bio;
        
        if (req.file) {
            updateData.avatar = `/uploads/images/${req.file.filename}`;
            console.log('✅ Avatar will be updated to:', updateData.avatar);
        }
        
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
        
        console.log('📦 Update data:', updateData);
        
        await user.update(updateData);
        await user.reload();
        
        console.log('✅ User after update:', {
            id: user.id,
            name: user.name,
            avatar: user.avatar
        });
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
                bio: user.bio || '',
                avatar: user.avatar || ''
            }
        });
        
    } catch (error) {
        console.error('❌ Update error:', error);
        
        if (error.name === 'SequelizeValidationError') {
            const errorMessage = error.errors.map(e => e.message).join(', ');
            return next(handleError(400, errorMessage));
        }
        
        next(handleError(500, error.message));
    }
}