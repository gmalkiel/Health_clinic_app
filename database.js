import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

/*const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'galit2944',
    database: 'health_clinic',
}).promise()

const result = await pool.query("select * from Therapists")
console.log(result)*/

async function getAllTherapists() {
    const [rows] = await pool.query("select * from Therapists")
    return rows
}
  
const therapists = await getAllTherapists()
console.log(therapists)