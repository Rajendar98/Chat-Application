import jwt from "jsonwebtoken"

export const verifyToken  = (request,response,next)=>{
    const token = request.cookies.jwt;
    if(!token){
        return response.status(401).send("You are not authorize");
    }
    jwt.verify(token,process.env.JWT_KEY ,async(err,payload)=>{
        if(err){
            return response.status(402).send("Token is not valid!");
        }
        request.userId = payload.userId;
        next();
    })
} 