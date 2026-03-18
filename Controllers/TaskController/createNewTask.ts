import type { Request, Response } from "express";
import client from "../../Database/config.js";

export default async function createNewTask(req: Request, res: Response){
    try{
      const { description: inputDescription , dueDate } = req.body;
      const userId = req.headers.user;

      if(!inputDescription || !dueDate || !userId) {
        return res.status(400).send({
            success: false,
            message: `Please provide values for mandatory fields`
        });
      } 

      const sql = `INSERT INTO tasks (description, created_at, updated_at, due_date, user_id, status)
                   values($1, $2, $3, $4, $5, $6) RETURNING * `
      const taskStatus = false;
      
      const { rows }  = await client.query(sql, [inputDescription, new Date(Date.now()), new Date(Date.now()), new Date(dueDate), userId, taskStatus]);
      const { task_id, description, due_date, user_id, status } = rows[0];
      return res.status(201).send({
        success: true,
        message: {
           taskId: task_id,
           description,
           dueDate: due_date,
           userId: user_id,
           status: status === 'true' ? true : false
        }
      })
    }catch(err){
        console.error(err);
        if(err instanceof Error){
            return res.status(500).send({success: false, message: err?.message})
        }
        return res.status(500).send({success: false, message: `Unknown error`})
    }
}