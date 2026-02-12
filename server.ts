import express from 'express'
import dotenv from 'dotenv'
import createTables from './Controllers/createTables.js';
import { userRouter, taskRouter } from './Routes/index.js'
import authHandler from './Middleware/authMiddleWare.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import morgan from 'morgan';
dotenv.config()

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['content-type', 'authorization']
}
));
app.use(morgan("dev"));
const port = process.env.PORT;

app.use(authHandler);
app.use('/user',userRouter);
app.use('/tasks',taskRouter);

(async () => {
  await createTables()
  app.listen(port, () => {
    console.log(`server listening at port: ${port}`)
  })
})()
