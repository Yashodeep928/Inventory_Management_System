import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const client = new Pool({
  user: process.env.MY_USER,
  host: process.env.MY_HOST,
  database: process.env.MY_DATABASE,
  password: process.env.MY_PASSWORD,
  port: process.env.MY_PORT,
});


client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database', err));

export default client;
