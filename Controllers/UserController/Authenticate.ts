import type { Request, Response } from "express";

export default async function verifyUser(req: Request, res: Response){
   return res.status(200).send({
    success: true,
    message: 'Authenticated user!'
   }) 
}