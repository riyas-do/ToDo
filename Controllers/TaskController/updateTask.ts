import client from "../../Database/config.js";
import type { Request, Response } from "express";
export async function updateTask(req: Request, res: Response){
   try{
    const {taskId, status } = req.body;
    const response = await client.query(`UPDATE tasks set status = $1 where task_id = $2 returning * `,[status, taskId]);
    return res.status(200).send({
        success: true,
        message: response
    });
   }catch(err){
     return res.status(500).send({
        success:false,
        message:'Unexpected error while updating task'
     })
   }
   
}