import User from "../models/user.model.js";

export const getUsersForSidebar = async(req,res) => {
    try {
        
        const loggedIn = req.user._id;

        const filteredUsers = await User.find({_id: {$ne : loggedIn}}).select('-password');  //exclude password this queryy means to find all the user in the database except the user which is equal to logged in user

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUsersFor Sidebar : ",error.message)
        res.status(500).json({error : "Internal server error"})
    }
}