import { Router } from 'express'
import createNewTask from '../Controllers/TaskController/createNewTask.js';
import getAllTask, { searchTasks } from '../Controllers/TaskController/readTask.js';
import { updateTask } from '../Controllers/TaskController/updateTask.js';
const taskRouter = Router()

taskRouter.route('/create').post(createNewTask);
taskRouter.route('/').get(getAllTask);
taskRouter.route('/task').get(searchTasks);
taskRouter.route('/update').patch(updateTask);

export default taskRouter;


