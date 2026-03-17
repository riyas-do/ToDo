import client from "../../Database/config.js";
import type { Request, Response } from "express";

export default async function getAllTask(req: Request, res: Response){
    try{
      const userId = req.headers.user;
      const filter = req.query.filter;
      let query = `SELECT * FROM tasks where user_id = $1 `;
      const today = new Date().toISOString().split('T')[0];
      if( filter === 'today'){ 
         query += `and Date(due_date) = '${today}'`;
        
      }else if( filter === 'upcoming'){
         query += `and Date(due_date) > '${today}'`
      }
      query += ` ORDER BY Date(due_date)`;
      const tasksData = await client.query(`${query}`, [userId] );
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
   const filter = req.query.filter;
    if(!searchParam){
        return res.status(404).send({
            success: false,
            message: 'No data found!'
        })
    }
    let query = `SELECT * FROM tasks WHERE user_id = $1 and description like '%' || $2 || '%'`
    const today = new Date().toISOString().split('T')[0];
      if( filter === 'today'){ 
         query += `and Date(due_date) = '${today}'`;
        
      }else if( filter === 'upcoming'){
         query += `and Date(due_date) > '${today}'`
      }
    query += ` ORDER BY Date(due_date)`;
    const searchResult = await client.query(query, [userId, searchParam]);
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
    

