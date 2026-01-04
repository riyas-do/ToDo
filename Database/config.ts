import { Pool } from 'pg';
import dotenv from 'dotenv';
import type { dbConfigTypes } from './types.js';
dotenv.config();

const config: dbConfigTypes = {
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_HOSTNAME)
}
const client = new Pool(config);

client.on('connect', ()=>{
    console.log('Db connection created successfully')
});

client.on('error', ()=>{
    console.error('Error connecting to db');
    process.exit(1);
})

export default client;
