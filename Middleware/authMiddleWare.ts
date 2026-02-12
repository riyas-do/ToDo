import jwt, { type JwtPayload } from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction){
  try{
    // const token = req.headers['authorization']?.split(' ')[1];
    const token = req.cookies.token;
    
    if(!token){
        return res.status(401).send({
            success: false,
            message: `Unauthorized user!`
        })
    }
    const secret = process.env.SECRET;
    if(!secret){
        throw new Error('Secret not defined in environment variables');
    }
    const {userId} = jwt.verify(token, secret) as JwtPayload;
    if(!userId){
        return res.status(401).send({
            success: false,
            message: `Unauthorized user!`
        });
    }
    req.headers.user = userId;
    return next();
  }catch(err){
    if(JSON.stringify(err)?.includes('expired')){
        return res.status(401).send({
            success: false,
            message: 'Token expired'
        })
    }
    return res.status(401).send({
            success: false,
            message: `Unauthorized user!`
    });
  }
   
};

const publicRoutes = ['/user/register', '/user/login', 'user/oauth2/redirect/google', '/user/refreshToken']
export default function authHandler(req: Request, res: Response, next: NextFunction){
   if(publicRoutes.includes(req.path)){
     return next();
   }
   return authenticate(req, res, next);
}