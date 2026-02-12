import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import client from "../../Database/config.js";
import verifyGoogleAuthToken from "./GoogleAuthVerification.js";
import jwt from 'jsonwebtoken';
import generateJwtToken from "../../helpers/generateToken.js";


function generateOTP(){
    let otpStr = "";
    for(let i =  0; i < 4; i++){
      otpStr += Math.floor(Math.random() * 10);
    }
    return otpStr;
}

export default async function createUser(req: Request, res: Response){
    try{
    const {name, email, password } = req.body;
    if( !name || !email || !password){
        return res.status(404).send({
            success: false,
            message: 'Please provide values for the mandatory fields'
        })
    }
    const user = await client.query(`SELECT email FROM users where email=$1`, [email]);
    if(user.rows?.length){
        return res.status(409).send({
            success: false,
            message: `User with emailId: ${email} already exists. Please login`
        });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    //Generate OTP:
    // const otp = generateOTP();
    // const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await client.query(`
        INSERT INTO users(name, email, password)
        values($1, $2, $3)
    `, [name, email, encryptedPassword])
    return res.status(201).send({success: true, message: `Please login to your account!`})
    }catch(err){
        console.error(err);
        if(err instanceof Error){
          return res.status(500).send({success: false, message: err?.message})
        }
        return res.status(500).send({success: false, message: 'Unknown error'}) 
    }
}

export async function AddGoogleAuthenticatedUser(req: Request, res: Response){
   try{
    const { idToken } = req.body;
   const payload = await verifyGoogleAuthToken(idToken);
   if( !payload ){
    return res.status(401).send({
        success: false,
        message: 'Unauthorized User!'
    });
   }
   const { name, email, picture } = payload;
   const userData = await client.query(`SELECT * FROM users where email = $1`, [email]);
   let user = userData?.rows[0];
   if(!user){
      let signedInUser = await client.query(`
           INSERT INTO users (name, email) values($1, $2) RETURNING *
        `, [name, email]);
      user = signedInUser.rows[0];
   }
   const token = generateJwtToken(user);
   return res.status(201).send({
    success: true,
    message: {
        ...user,
        token
    }
   });
   }catch(err){
    throw err;
   }
}