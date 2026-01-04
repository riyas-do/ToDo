import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from "../../Database/config.js";
import type { Request, Response } from 'express';

export async function login(req: Request, res: Response){
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
        })
     }
     delete userData.password;
     const secret = process.env.SECRET;
     if(!secret){
        throw new Error('secret is not defined in environment variable')
     }
     const token = jwt.sign({userId: userData.id}, secret, {
        expiresIn: '1d'
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
