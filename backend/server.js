import path from "path"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"


import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";


const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());  //this allows the extraction of data fields from the json we are getting from the     req.body ....... to parse the incoming requests with the JSON payloads (from req.body)

app.use(cookieParser())     //call this middleware to access the cookies


app.use("/api/auth", authRoutes)   //if suppose we visit the /api/auth/login page then the login functions in 
//  authroutes will be called. THIS IS THE CONCEPT OF MIDDLEWARES


// app.get('/', (req, res) => {
//     //root route http://localhost:5000/
//     res.send("hello world!!!!")
// })

app.use("/api/messages", messageRoutes)

app.use("/api/users", userRoutes)

//static middleware provided by express which is used to serve basic static files
app.use(express.static(path.join(__dirname,"/frontend/dist")))  //it will join the path  of current directory with /frontend/dist  in this dist folder vite will put all the frontend folder through npm run build it is so that it optimizes the production


app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`)
});

