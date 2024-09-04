import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()


export async function getAllTherapists() {
    const [rows] = await pool.query("select * from Therapists")
    return rows
}
  
//const therapists = await getAllTherapists()
//console.log(therapists)

export async function getTherapist(id) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM Therapists
  WHERE TherapistID = ?
  `, [id])
  return rows[0]
}

//const therapist = await getTherapist(4)
//console.log(therapist)

export async function createTherapist(Name, IDNumber, DateOfBirth, Email, Phone) {
  const [result] = await pool.query(`
  INSERT INTO Therapists (Name, IDNumber, DateOfBirth, Email, Phone)
  VALUES (?, ?, ?, ?, ?)
  `, [Name, IDNumber, DateOfBirth, Email, Phone])
  const id = result.insertId
  return getTherapist(id)
}

//const therapist = await createTherapist("Oren", "555555", "1992-09-06", "therapist8@example.com", "123-456-7893")
//console.log(therapist)





/*
thing to save just in case

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'galit2944',
    database: 'health_clinic',
}).promise()

const result = await pool.query("select * from Therapists")
console.log(result)*/