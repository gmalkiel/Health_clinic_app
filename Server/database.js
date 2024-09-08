import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: '127.0.0.1',
  user:'root',
  password: 'Hadas1589',
  database: 'health_clinic'
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

export async function getTherapistByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM Therapists WHERE Name = ?', [username]);
  return rows[0];
}
//const therapist = await createTherapist("Oren", "555555", "1992-09-06", "therapist8@example.com", "123-456-7893")
//console.log(therapist)

/*export async function updateTherapist(id, Name, Email, Phone) {
  const therapist = await getTherapist(id);
  const updatedName = Name || therapist.Name;
  const updatedEmail = Email || therapist.Email;
  const updatedPhone = Phone || therapist.Phone;
  const [result] = await pool.query(`
  UPDATE Therapists 
  SET Name = ?, IDNumber = ?, DateOfBirth = ?, Email = ?, Phone = ?
  WHERE TherapistID = ?
  `, [Name, Email, Phone, id]);
  return getTherapist(id);
}*/

export async function updateTherapist(id, Name, Email, Phone) {
  const therapist = await getTherapist(id);
  const fieldsToUpdate = [];
  const valuesToUpdate = [];

  if (Name) {
      fieldsToUpdate.push('Name = ?');
      valuesToUpdate.push(Name);
  }
  if (Email) {
      fieldsToUpdate.push('Email = ?');
      valuesToUpdate.push(Email);
  }
  if (Phone) {
      fieldsToUpdate.push('Phone = ?');
      valuesToUpdate.push(Phone);
  }

  if (fieldsToUpdate.length === 0) {
      throw new Error('No fields to update');
  }

  const sql = `
    UPDATE Therapists 
    SET ${fieldsToUpdate.join(', ')}
    WHERE TherapistID = ?
  `;
  valuesToUpdate.push(id);

  const [result] = await pool.query(sql, valuesToUpdate);

  return getTherapist(id);
}







/*
things to save just in case

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'galit2944',
    database: 'health_clinic',
}).promise()

const result = await pool.query("select * from Therapists")
console.log(result)*/