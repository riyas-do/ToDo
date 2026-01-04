import type { Request, Response } from "express";

export default async function createNewTask(req: Request, res: Response){
    try{
      
    }catch(err){
        console.error(err);
        if(err instanceof Error){
            throw new Error(err?.message)
        }
        throw new Error(`Unknow error`);
    }
}