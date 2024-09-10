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

export async function createTherapist(Name, IDNumber, DateOfBirth, Email, UserName, T_Password,Phone,Gender, Adress ) {
  const [result] = await pool.query(`
  INSERT INTO Therapists (Name, IDNumber, DateOfBirth, Email, UserName, T_Password,Phone,Gender, Adress)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [Name, IDNumber, DateOfBirth, Email, UserName, T_Password,Phone,Gender, Adress])
  const id = result.insertId
  return getTherapist(id)
}

export async function getTherapistByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM Therapists WHERE UserName = ?', [username]);
  if(rows){
  return rows[0]};
  return null;
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
    SELECT Patients.* 
    FROM TherapistPatients 
    JOIN Patients ON TherapistPatients.PatientID = Patients.PatientID
    WHERE TherapistPatients.TherapistID = ?
  `, [therapistId]);
  return rows;
}


/*
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
  const connection = await pool.getConnection(); 
  try {
      await connection.beginTransaction();

      await connection.query(`
          DELETE FROM TherapistPatients 
          WHERE PatientID = ?
      `, [patientID]);

      await connection.query(`
          DELETE FROM Patients 
          WHERE PatientID = ?
      `, [patientID]);

      await connection.commit();
  } catch (error) {
      await connection.rollback();
      throw error;
  } finally {
      connection.release(); 
  }
}

//Appointments functions

export async function getAllAppointments() {
  const [rows] = await pool.query(`
      SELECT 
          a.AppointmentID,
          a.AppointmentsDay,
          a.AppointmentsTime,
          a.Location,
          p.Name AS PatientName,
          p.Age AS PatientAge,
          t.Name AS TherapistName,
          t.IDNumber AS TherapistIDNumber
      FROM 
          Appointments a
      JOIN 
          Patients p ON a.PatientID = p.PatientID
      JOIN 
          Therapists t ON a.TherapistID = t.TherapistID
  `);
  return rows;
}

export async function getTherapistAppointments(id) {
  const [rows] = await pool.query(`
    SELECT a.*,  t.Name as TherapistName, p.Name as PatientName
    FROM Appointments a
    JOIN Therapists t ON a.TherapistID = t.TherapistID
    JOIN Patients p ON a.PatientID = p.PatientID
    WHERE a.TherapistID = ?
  `, [id]);
  return rows;
}

export async function getAppointment(appointmentId) {
   // שאלת SQL שמחזירה פרטי פגישה ופרטי מטופלים
   const [rows] = await pool.query(`
    SELECT a.*, p.*
    FROM Appointments a
    JOIN Patients p ON a.PatientId = p.PatientId
    WHERE a.AppointmentId = ?
  `, [appointmentId]);

  if (rows.length === 0) {
    return null; // במקרה ואין פגישה עם מזהה כזה
  }

  const appointment = rows[0];
  const patients = rows.map(row => ({
    PatientId: row.PatientId,
    FirstName: row.FirstName,
    LastName: row.LastName,

  }));

  return {
    Appointment: {
      AppointmentId: appointment.AppointmentId,
      Date: appointment.Date,
      Time: appointment.Time,

    },
    Patients: patients
  };
}

export async function getTherapistByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM Therapists WHERE Email = ?', [email]);
  return rows[0];
}

/* פונקציות בכדי לבצע מחיקה נכונה של מטפל*/
export async function transferPatients(oldTherapistID, newTherapistID) {
  const [result] = await pool.query(`
    UPDATE TherapistPatients tp
    SET tp.TherapistID = ?
    WHERE tp.TherapistID = ?
  `, [newTherapistID, oldTherapistID]);
  return result;
}


