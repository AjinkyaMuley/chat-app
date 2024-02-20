import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        //HASHING THE PASSWORD HERE (WE DO THIS SO THAT IF THE DATABASE GETS LEAKED NOONE)

        const salt = await bcrypt.genSalt(10);  //more the value in arguements morem it will be the secure but more it will be slower
        const hashedPassword = await bcrypt.hash(password, salt);

        //https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        if (newUser) {

            //Generate JWT token here
            generateTokenAndSetCookie(newUser._id, res);

            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            })
        }
        else {
            res.status(400).json({ error: "Invalid user data" })
        }

    }
    catch (error) {
        console.log("Error in SignUp Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const login = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");    //comparing the bcrypted password will not be done by if statement as it is coded into 32 bit code so bcrypt.compare() is used so to check the input password is equal to the actual password stored in the database

        // user?.password || "" this part is added because user gives undefined input or a username which does not exist it will return an error which would be handled by the catch block but it is not a server error. so to nullify this type of extra error we use this sentence to compare it with a null string for password

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error : "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            username : user.username,
            profilePic : user.profilePic
        })

    } catch (error) {
        console.log("Error in Login Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const logout =  (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message : "Logged out successfully"});
    } catch (error) {
        console.log("Error in Logout Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}