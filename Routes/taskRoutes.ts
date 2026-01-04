import { Router } from 'express'
import createNewTask from '../Controllers/TaskController/createNewTask.js'

const router = Router()

router.route('/task').post(createNewTask)
