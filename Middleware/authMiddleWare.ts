import jwt, { type JwtPayload } from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';

function authenticate(req: Request, res: Response, next: NextFunction){
    const token = req.headers['authorization']?.split(' ')[1];
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
    return next();
};

const publicRoutes = ['/register', '/login']
export default function authHandler(req: Request, res: Response, next: NextFunction){
   if(publicRoutes.includes(req.path)){
     return next();
   }
   return authenticate(req, res, next);
}