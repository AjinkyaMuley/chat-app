import express from "express"
import {login, logout, signup} from '../controllers/auth.controller.js'

const router = express.Router()

//when this  route is hit it will call the login function in our controller and return a response with any data that is returned by that function in the controller files

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

export default router