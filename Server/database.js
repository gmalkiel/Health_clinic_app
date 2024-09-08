import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: '127.0.0.1',
  user:'root',
  password: 'galit2944',
  database: 'health_clinic'
}).promise()

//Therapists functions

export async function getAllTherapists() {
    const [rows] = await pool.query("select * from Therapists")
    return rows
}

export async function getTherapist(id) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM Therapists
  WHERE TherapistID = ?
  `, [id])
  return rows[0]
}

export async function createTherapist(Name, IDNumber, DateOfBirth, Email, Phone) {
  const [result] = await pool.query(`
  INSERT INTO Therapists (Name, IDNumber, DateOfBirth, Email, Phone)
  VALUES (?, ?, ?, ?, ?)
  `, [Name, IDNumber, DateOfBirth, Email, Phone])
  const id = result.insertId
  return getTherapist(id)
}

export async function getTherapistByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM Therapists WHERE UserName = ?', [username]);
  console.log(rows[0]);
  return rows[0];
}

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

export async function deleteTherapist(id) {
  const [result] = await pool.query(`
      DELETE FROM Therapists WHERE TherapistID = ?
  `, [id]);
  return result;  
}

//Patient functions

export async function getPatient(id) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM Patients
  WHERE PatientID = ?
  `, [id]);
  return rows[0];
}

export async function getAllPatients() {
  const [rows] = await pool.query(`
    SELECT * 
    FROM Patients
  `);
  return rows;
}

export async function getPatientsByTherapist(therapistId) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM TherapistPatients 
  WHERE TherapistID = ?
  `, [therapistId]);
  return rows;
}

/*
    "MaritalStatus": "Single",
    "TreatmentGoals": "Goal 1",
    "SiblingPosition": 1,
    "EducationalInstitution": "Institution 1",
    "Diagnoses": "Diagnosis 1",
    "RiskLevel": "Low",
    "Medication": "Medication 1",
    "ReferralSource": "Referral 1",
    "RemainingSessions": 10,
    "RemainingPayment": "100.00",
    "AppointmentDateTime": "2024-08-20T07:00:00.000Z"
    

export async function updatePatient(id, Name, Age, Email, Phone) {
  const [result] = await pool.query(`
  UPDATE Patients 
  SET Name = ?, IDNumber = ?, DateOfBirth = ?, Email = ?, Phone = ?
  WHERE PatientID = ?
  `, [Name, IDNumber, DateOfBirth, Email, Phone, id]);
  return getPatient(id);
}
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
}*/

//Sessions functions

export async function getSessionsByPatient(patientId) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM Sessions
  WHERE PatientID = ?
  `, [patientId]);
  return rows;
}

export async function getSession(sessionId) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM Sessions
  WHERE SessionID = ?
  `, [sessionId]);
  return rows[0];
}

export async function createSession(PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImage) {
  const [result] = await pool.query(`
  INSERT INTO Sessions (PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImage)
  VALUES (?, ?, ?, ?, ?)
  `, [PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImage]);
  const sessionId = result.insertId;
  return getSession(sessionId);
}

export async function updateSession(id, SessionContent, SessionSummary, ArtworkImage) {

  const fieldsToUpdate = [];
  const valuesToUpdate = [];

  if (SessionContent) {
      fieldsToUpdate.push('SessionContent = ?');
      valuesToUpdate.push(SessionContent);
  }
  if (SessionSummary) {
      fieldsToUpdate.push('SessionSummary = ?');
      valuesToUpdate.push(SessionSummary);
  }
  if (ArtworkImage) {
      fieldsToUpdate.push('ArtworkImage = ?');
      valuesToUpdate.push(ArtworkImage);
  }
  
  const sql = `
    UPDATE Sessions 
    SET ${fieldsToUpdate.join(', ')}
    WHERE SessionID = ?
  `;
  valuesToUpdate.push(id);

  const [result] = await pool.query(sql, valuesToUpdate);

  return getSession(id);
}

export async function deletePatient(patientID) {
  const connection = await pool.getConnection(); // יצירת חיבור לעבודה עם טרנזקציות
  try {
      await connection.beginTransaction();

      // מחיקת הקשר עם המטפל מטבלת TherapistPatients
      await connection.query(`
          DELETE FROM TherapistPatients 
          WHERE PatientID = ?
      `, [patientID]);

      // מחיקת המטופל מטבלת Patients
      await connection.query(`
          DELETE FROM Patients 
          WHERE PatientID = ?
      `, [patientID]);

      await connection.commit(); // סיום טרנזקציה והתחייבות לשינויים
  } catch (error) {
      await connection.rollback(); // במידה ויש שגיאה, מבטלים את כל השינויים
      throw error;
  } finally {
      connection.release(); // שחרור החיבור חזרה לבריכה
  }
}



/*
export async function createPatient(Name, IDNumber, DateOfBirth, Email, Phone) {
  const [result] = await pool.query(`
  INSERT INTO Patients (Name, IDNumber, DateOfBirth, Email, Phone)
  VALUES (?, ?, ?, ?, ?)
  `, [Name, IDNumber, DateOfBirth, Email, Phone]);
  const id = result.insertId;
  return getPatient(id);
}

*/



/*
things to save just in case

const therapist = await createTherapist("Oren", "555555", "1992-09-06", "therapist8@example.com", "123-456-7893")
console.log(therapist)

export async function updateTherapist(id, Name, Email, Phone) {
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
}

const result = await pool.query("select * from Therapists")
console.log(result)*/