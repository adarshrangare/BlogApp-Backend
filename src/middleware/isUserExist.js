
const User = require("../models/userModel");

const isUserExist = async (req,res)=>{
    const {username,email,password} = req.body;

    const userByUserName = await User.findOne({username}).select("-password");
    const userByEmail = await User.findOne({email}).select("-password");

    if(userByUserName){
        return {
            status: false,
            message: "Username already exist"
        }
    } else if(email){
        return {
            status: false,
            message: "Username already exist"
        }
    }
   

}