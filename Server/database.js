import mysql from 'mysql2'

import dotenv from 'dotenv'
import path from 'path';
import fs from 'fs';

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


export async function createPatient(Name, Age, IDNumber, MaritalStatus = null, SiblingPosition = null, SiblingsNumber = null, EducationalInstitution = null, Medication = null, ReferralSource = null, TherapistID) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
      const [result] = await connection.query(`
          INSERT INTO Patients (Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource]);

      const patientId = result.insertId;

      await connection.query(`
          INSERT INTO TherapistPatients (TherapistID, PatientID)
          VALUES (?, ?)
      `, [TherapistID, patientId]); 

      await connection.commit();

      return patientId;
  } catch (error) {
      await connection.rollback();
      throw error;
  } finally {
      connection.release();
  }
}

export async function updatePatient(patientId, patientData) {
  const updates = [];
  const values = [];
  let appointmentTimeUpdated = false;
  // Ensure patientId is an integer
  const patientIdInt = parseInt(patientId, 10);

  // Check if patientIdInt is a valid number
  if (isNaN(patientIdInt)) {
      throw new Error('Invalid patientId provided');
  }

  // Check if AppointmentTime is part of the update data
  if (patientData.AppointmentTime) {
      appointmentTimeUpdated = true;
  }

  // Build the update query
  for (const key in patientData) {
    updates.push(`${key} = ?`);
    values.push(patientData[key]);
  }

  // Add the patientId to the values array
  values.push(patientId); 

  if (updates.length > 0) {
      // Update the patient record
      try {
          const query = `
              UPDATE Patients
              SET ${updates.join(', ')}
              WHERE PatientID = ?
          `;
          console.log('Executing query:', query);
          console.log('With values:', values);

          await pool.query(query, values);
      } catch (error) {
          console.error('Error updating patient:', error.message);
          throw error;
      }
  }

  // If AppointmentTime is updated, create a new Appointment
  if (appointmentTimeUpdated) {
    let therapistID;

    try {
        // Retrieve the TherapistID associated with the patient
        const query = `
            SELECT TherapistID
            FROM TherapistPatients
            WHERE PatientID = ?
        `;
        console.log('Executing query:', query);
        console.log('With values:', [patientIdInt]);

        const [rows] = await pool.query(query, [patientIdInt]);

        if (rows.length === 0) {
            throw new Error('No associated therapist found for this patient');
        }

        therapistID = rows[0].TherapistID;
    } catch (error) {
        console.error('Error retrieving therapistID:', error.message);
        throw error;
    }

    const [day, time] = patientData.AppointmentTime.split(' ');

      try {
          // Check if an appointment with the same day and time already exists for the therapist
          const checkQuery = `
              SELECT COUNT(*) AS count
              FROM Appointments
              WHERE TherapistID = ?
              AND AppointmentsDay = ?
              AND AppointmentsTime = ?
          `;
          console.log('Executing query:', checkQuery);
          console.log('With values:', [therapistID, day, time]);

          const [[result]] = await pool.query(checkQuery, [therapistID, day, time]);

          if (result.count > 0) {
              throw new Error('An appointment with the same day and time already exists for this therapist');
          }

          // Insert the new appointment if no conflicts
          const insertQuery = `
              INSERT INTO Appointments (TherapistID, PatientID, AppointmentsDay, AppointmentsTime, Location)
              VALUES (?, ?, ?, ?, ?)
          `;
          console.log('Executing query:', insertQuery);
          console.log('With values:', [therapistID, patientIdInt, day, time, '']); // Add Location if needed

          await pool.query(insertQuery, [therapistID, patientIdInt, day, time, '']);
      } catch (error) {
          console.error('Error processing appointment:', error.message);
          throw error;
        }
  }

}


export async function isPatientExists(idNumber) {
  try {
    const [rows] = await pool.query(`
      SELECT PatientID
      FROM Patients
      WHERE IDNumber = ?
    `, [idNumber]);

    // אם יש תוצאה מהשאילתה, המטופל קיים במערכת
    if (rows.length > 0) {
      return {
        exists: true,
        patientID: rows[0].PatientID
      };
    } else {
      return {
        exists: false,
        patientID: null
      };
    }
  } catch (error) {
    console.error('Error checking if patient exists:', error);
    throw error;
  }
}


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

export async function createSession(PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImagePath) {
  setSuccess('im in create');
  const [result] = await pool.query(`
    INSERT INTO health_clinic.Sessions (sessionContent, sessionSummary, patientId, artworkImage, SessionDate)
    VALUES (?, ?, ?, ?, ?)
  `, [SessionContent, SessionSummary, PatientID, imageData, SessionDate]);

  const id = result.insertId;
  return getSession(id); // Assuming you have a getSession function
}

export async function createNewSession(PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImagePath) {
  try {
    const imagePath = path.resolve(ArtworkImagePath);
    const imageData = fs.readFileSync(imagePath); // Read the image data as binary
    const [result] = await pool.query(`
      INSERT INTO Sessions (SessionContent, SessionSummary, PatientID, ArtworkImage, SessionDate)
      VALUES (?, ?, ?, ?, ?)
    `, [SessionContent, SessionSummary, PatientID, imageData, SessionDate]);

    const id = result.insertId;
    return getSession(id); // Assuming you have a getSession function
  } catch (error) {
    console.error('Error in createSession:', error.message);
    throw error;
  }
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

export async function deleteTherapist(therapistID) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Delete appointments related to the therapist
    await connection.query(`
      DELETE FROM Appointments
      WHERE TherapistID = ?
    `, [therapistID]);

    // Delete the therapist from TherapistPatients table
    await connection.query(`
      DELETE FROM TherapistPatients
      WHERE TherapistID = ?
    `, [therapistID]);

    // Delete messages related to the therapist
    await connection.query(`
      DELETE FROM Messages
      WHERE TherapistID = ?
    `, [therapistID]);

    // Delete the therapist from Therapists table
    const [result] = await connection.query(`
      DELETE FROM Therapists
      WHERE TherapistID = ?
    `, [therapistID]);

    await connection.commit();
    return result;
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


export async function addMessage(therapistID, content) {
  try {
      const query = `
          INSERT INTO Messages (TherapistID, Content)
          VALUES (?, ?)
      `;
      console.log('Executing query:', query);
      console.log('With values:', [therapistID, content]);

      await pool.query(query, [therapistID, content]);
  } catch (error) {
      console.error('Error inserting message:', error.message);
      throw error;
  }
}

export async function deleteMessage(messageID) {
  try {
      const query = `
          DELETE FROM Messages
          WHERE MessageID = ?
      `;
      console.log('Executing query:', query);
      console.log('With values:', [messageID]);

      await pool.query(query, [messageID]);
  } catch (error) {
      console.error('Error deleting message:', error.message);
      throw error;
  }
}

export async function getMessagesForTherapist(therapistID) {
  try {
      const query = `
          SELECT MessageID, Content
          FROM Messages
          WHERE TherapistID = ?
      `;
      console.log('Executing query:', query);
      console.log('With values:', [therapistID]);

      const [rows] = await pool.query(query, [therapistID]);

      return rows;
  } catch (error) {
      console.error('Error retrieving messages:', error.message);
      throw error;
  }
}
