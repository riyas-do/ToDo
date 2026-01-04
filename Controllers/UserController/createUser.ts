import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import client from "../../Database/config.js";


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
    const user = await client.query(`SELECT email FROM users where email=$1`, [email]);
    if(user){
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
        values($1, $2, $3),
    `, [name, email, encryptedPassword])
    return res.send(201).send({success: true, message: `Please login to your account!`})
    }catch(err){
        console.error(err);
        if(err instanceof Error){
           throw new Error(err?.message);
        }
        throw new Error('Unknown error occurred') 
    }
}