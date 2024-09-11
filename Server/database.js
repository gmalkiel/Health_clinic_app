import mysql from 'mysql2'

import dotenv from 'dotenv'
import path from 'path';
import fs from 'fs';

dotenv.config()
export const pool = mysql.createPool({
  host: '127.0.0.1',
  user:'root',
  password: 'galit2944',
  database: 'health_clinic'
}).promise()
export default pool;