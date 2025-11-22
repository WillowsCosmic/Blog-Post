import express from 'express'
import { getUser,updateUser } from '../controllers/User.controller.js'
import { profileUpload } from '../middlewares/multer.js'

const UserRoute = express.Router()

UserRoute.get('/get-user/:userid',getUser)
UserRoute.put('/update-user/:userid', profileUpload, updateUser)


export default UserRoute