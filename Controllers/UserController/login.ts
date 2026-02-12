import bcrypt from 'bcrypt';
import client from "../../Database/config.js";
import type { Request, Response } from 'express';
import generateJwtToken from '../../helpers/generateToken.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export default async function login(req: Request, res: Response){
   try{
     const { email, password } = req.body;
     if(!email || !password){
        return res.status(400).send({
            success: false, message: 'Please provide email and password'
        })
     }
     const user = await client.query(`
           SELECT id, email, password, name from users where email=$1`,
           [email]
     );

     const userData = user.rows[0];
     if(!userData){
        return res.status(404).send({
            success: false, message: `No user found with email: ${email}`
        })
     }
     const isValid = await bcrypt.compare(password, userData.password)
     if(!isValid){
        return res.status(400).send({
            success: true, message: `Username or Password is incorrect!`
        });
     }
     delete userData.password;
     const token = generateJwtToken(userData);
     res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
     });
     
     const newRefreshToken = generateJwtToken(userData, true);
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

     return res.status(200).send({
        success: true, message: {
            ...userData,
            token
        }
     });
    }catch(err){
      console.error(`Error occurred while login`);
      if(err instanceof Error){
        throw new Error(err.message)
      }
      throw new Error(`Unexpected error occurred`);
    }
}

export async function generateRefreshToken(req: Request, res: Response){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
         return res.status(401).send({
            success: false,
            message: 'Unauthorized user!'
         })
    }
    const secret = process.env.SECRET;
    const refreshTokenSecret = process.env.REFRESH_SECRET;
    if(!refreshTokenSecret || !secret){
        throw new Error('Secret not added for refresh token');
    }
    const {userId} = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;
    if(!userId) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized user!'
        });
    }
    const userData = {
        id: userId
    }
    const token = generateJwtToken(userData);
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    const newRefreshToken = generateJwtToken(userData, true);
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    return res.status(200).send({
        success: true,
        message: 'RefreshToken generated successfully'
    });
    
}


export async function logout(req: Request, res: Response){
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    });
    return res.status(200).send({
        success: true, 
        message: 'User logged out!'
    });
}
