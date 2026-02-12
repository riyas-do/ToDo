import client from "../../Database/config.js";
import type { Request, Response } from "express";

export default async function getAllTask(req: Request, res: Response){
    try{
      const userId = req.headers.user;
      const tasksData = await client.query(`
           SELECT * FROM tasks where user_id = $1`, [userId] );
      const tasks = tasksData.rows;
      if(tasks?.length){
        return res.status(200).send({
            success: true,
            message: tasks
        })
      }
      return res.status(404).send({
        success: false,
        message: 'No data found!'
      });
    }catch(err){
        if(err instanceof Error){
            return res.status(500).send({
                success: false,
                message: err?.message
            })
        }
        return res.status(500).send({
                success: false,
                message: err
            })
    }
}

export async function searchTasks(req: Request, res: Response){
  try{
   const userId = req.headers.user;
   const searchParam = req.query.search;
    if(!searchParam){
        return res.status(404).send({
            success: false,
            message: 'No data found!'
        })
    }
    const searchResult = await client.query(`SELECT * FROM tasks WHERE user_id = $1 and description like '%' || $2 || '%'`, [userId, searchParam]);
    const searchData = searchResult.rows; 
    if(!searchData.length){
       return res.status(404).send({
            success: false,
            message: 'No data found!'
        })
    }
    return res.status(200).send({
        success: true,
        message: searchData
    });
  }catch(err){
    console.log(err)
    if(err instanceof Error){
            return res.status(500).send({
                success: false,
                message: err?.message
            })
        }
        return res.status(500).send({
                success: false,
                message: err
            })
    }
  }
    

