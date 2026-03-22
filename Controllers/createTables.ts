import client from '../Database/config.js'
export default async function createTables() {
  const schema = `
     CREATE EXTENSION IF NOT EXISTS pgcrypto;

     CREATE TABLE IF NOT EXISTS users(
       name VARCHAR(64) NOT NULL,
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       email VARCHAR(255) NOT NULL,
       password TEXT,
       OTP VARCHAR(4),
       OTP_expires TIMESTAMP
     );

     CREATE TABLE IF NOT EXISTS tasks(
       task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       description TEXT NOT NULL,
       created_at TIMESTAMP,
       updated_at TIMESTAMP,
       due_date TIMESTAMP NOT NULL,
       user_id UUID REFERENCES users(id) ON DELETE CASCADE,
       status BOOLEAN
     );
    `
  try {
    await client.query(schema)
    console.log(`Tables created successfully`)
  } catch (err) {
    console.error(err)
    throw err
  }
  return
}
