import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);     //get the message history between the current user and the user with the id passed



router.post("/send/:id", protectRoute, sendMessage);     //protectRoute so that noone cannot send msg through other only logged in users can

export default router;