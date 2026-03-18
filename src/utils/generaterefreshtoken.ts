import Jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, REFRESH_TOKEN_EXPIRES_IN } from "../config/jwt";

export const generateRefreshToken = (payload: object)=>{
    return Jwt.sign(payload, JWT_REFRESH_SECRET,{
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
    })
}