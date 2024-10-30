// AuthControllers.js
import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync,unlinkSync } from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => { // Fixed typo here
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge
    });
};

export const signup = async (request, response) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password are required");
        }
        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            },
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error"); // Changed status code
    }
};

export const login = async (request, response) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password are required");
        }
        const user = await User.findOne({ email });
        if(!user){
            return response.status(404).send("Email is not found!.");
        }
        const auth = compare(password,user.password);
        if(!auth){
            return response.status(400).send("Password is incorrect!.");
        }
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstname:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color
            },
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error"); // Changed status code
    }
};

export const getUserInfo = async (request, response) => {
    try {
      const user = await User.findById(request.userId);
    //   console.log(request.userId);
      if (!user) {
        return response.status(404).send("User not found.");
      }
      return response.status(200).json({
          id: user.id,
          email: user.email,
          profileSetup: user.profileSetup,
          firstname: user.firstName,
          lastName: user.lastName,
          image: user.image,
          color: user.color
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };

  
export const updateProfile = async (request, response,next) => {
    try {
        const { userId } = request;
        const { firstName,lastName,color} = request.body;
    if(!firstName || !lastName){
        return response.status(400).send("FirstName lastName and Color is required");
    }
    const user = await User.findByIdAndUpdate(userId,{
        firstName,
        lastName,
        color,
        profileSetup: true,
        },
        { new: true, 
          runValidators:true
        }
    )
    console.log(user);
      return response.status(200).json({
          id: user.id,
          email: user.email,
          profileSetup: user.profileSetup,
          firstname: user.firstName,
          lastName: user.lastName,
          image: user.image,
          color: user.color
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };


  export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("File is required");
        }
        
        const date = Date.now(); 
        let fileName = `uploads/profiles/${date}-${request.file.originalname}`; 
        renameSync(request.file.path, fileName); 
        const updatedUser = await User.findByIdAndUpdate(
            request.userId,
            { image: fileName },
            { new: true, runValidators: true }
        );

        return response.status(200).json({
            image: updatedUser.image
        });
    } catch (error) {
        console.error(error); 
        return response.status(500).send("Internal Server Error");
    }
};

  
  export const removeprofileImage = async (request, response,next) => {
    try {
        const { userId } = request;
        const user = await User.findById(userId);
        if(!user){
            return response.status(404).send("User not Found");
        }
        console.log(user.image);
        if(user.image){
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();
      return response.status(200).send("Profile image removed successfully");
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };


  export const logout = async (request, response,next) => {
    try {
        response.cookie("jwt","",{maxAge:1, secure:true,sameSite:"None"})
      return response.status(200).send("Logout successfully");
    } catch (error) {
      console.log(error);
      return response.status(500).send("Internal Server Error");
    }
  };