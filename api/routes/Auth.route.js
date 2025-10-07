import express from 'express'
import { GoogleLogin, login, logout, register } from '../controllers/Auth.controller.js'

const AuthRoute = express.Router()

AuthRoute.post('/register',register)
AuthRoute.post('/login',login)
AuthRoute.post('/google-login',GoogleLogin)
AuthRoute.post('/logout',logout)

export default AuthRoute