import jwt from 'jsonwebtoken';

type userType = {
    id: string
}
export default function generateJwtToken(userData: userType, refreshToken = false){
     const secret = refreshToken ? process.env.REFRESH_SECRET: process.env.SECRET;
     if(!secret){
        throw new Error('secret is not defined in environment variable')
     }
     const token = jwt.sign({userId: userData.id}, secret, {
        expiresIn: refreshToken ? '7d': '1d'
    });
    return token;
}
