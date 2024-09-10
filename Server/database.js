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
/*
export async function createPatient(
  Name, 
  Age, 
  MaritalStatus, 
  SiblingPosition, 
  SiblingsNumber, 
  IDNumber, 
  EducationalInstitution, 
  ReferralSource, // First occurrence of ReferralSource
  RemainingPayment, 
  TherapistID, 
  RemainingSessions,
  TreatmentGoals = "nop",
  Diagnoses = "nop",
  RiskLevel = "nop",
  Medication = "nop",
 // Renamed to avoid duplicate parameter name
)  {
  try {
    const [result] = await pool.query(`
      INSERT INTO Patients (Name, Age, IDNumber,MaritalStatus, TreatmentGoals,SiblingPosition, SiblingsNumber, EducationalInstitution,Diagnoses,RiskLevel,Medication, ReferralSource, RemainingSessions , RemainingPayment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
    `, [Name, Age, IDNumber,MaritalStatus, TreatmentGoals,SiblingPosition, SiblingsNumber, EducationalInstitution,Diagnoses,RiskLevel,Medication, ReferralSource, RemainingSessions , RemainingPayment]);

    const patientId = result.insertId;

    // Insert into TherapistPatients table as well
    await pool.query(`
      INSERT INTO TherapistPatients (TherapistID, PatientID)
      VALUES (?, ?)
    `, [TherapistID, patientId]);

    return getPatient(patientId);
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
}*/


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

/*export async function createPatient(patientData) {
  const { Name, Age, IDNumber, MaritalStatus, TreatmentGoals, SiblingPosition, SiblingsNumber, EducationalInstitution, Diagnoses, RiskLevel, Medication, ReferralSource, RemainingSessions, RemainingPayment, AppointmentTime } = patientData;
  
  const [result] = await pool.query(`
      INSERT INTO Patients (Name, Age, IDNumber, MaritalStatus, TreatmentGoals, SiblingPosition, SiblingsNumber, EducationalInstitution, Diagnoses, RiskLevel, Medication, ReferralSource, RemainingSessions, RemainingPayment, AppointmentTime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [Name, Age, IDNumber, MaritalStatus, TreatmentGoals, SiblingPosition, SiblingsNumber, EducationalInstitution, Diagnoses, RiskLevel, Medication, ReferralSource, RemainingSessions, RemainingPayment, AppointmentTime]);

  return result;
}*/
/*
export async function createPatient(TherapistID, Name, Age, IDNumber, MaritalStatus = null, SiblingPosition = null, SiblingsNumber = null, EducationalInstitution = null, Medication = null, ReferralSource = null) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
      // Insert into the Patients table
      const [result] = await connection.query(`
          INSERT INTO Patients (Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource]);

      const patientId = result.insertId; // Get the newly inserted PatientID

      await connection.query(`
          INSERT INTO TherapistPatients (TherapistID, PatientID)
          VALUES (?, ?)
      `, [TherapistID, patientId]); 

      // Commit the transaction if both inserts are successful
      await connection.commit();

      return patientId;
  } catch (error) {
      // Rollback the transaction in case of an error
      await connection.rollback();
      throw error;
  } finally {
      // Release the connection back to the pool
      connection.release();
  }
}*/

export async function createPatient(Name, Age, IDNumber, MaritalStatus = null, SiblingPosition = null, SiblingsNumber = null, EducationalInstitution = null, Medication = null, ReferralSource = null, TherapistID) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
      // הכנסת המטופל לטבלת ה-Patients
      const [result] = await connection.query(`
          INSERT INTO Patients (Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource]);

      const patientId = result.insertId; // קבלת מזהה המטופל שנוצר

      // הכנסת הקישור בין המטפל למטופל לטבלת TherapistPatients
      await connection.query(`
          INSERT INTO TherapistPatients (TherapistID, PatientID)
          VALUES (?, ?)
      `, [TherapistID, patientId]); 

      // אישור העסקה במידה ושני השאילתות עברו בהצלחה
      await connection.commit();

      return patientId;
  } catch (error) {
      // ביטול העסקה במידה ויש שגיאה
      await connection.rollback();
      throw error;
  } finally {
      // שחרור החיבור חזרה לבריכה
      connection.release();
  }
}



export async function updatePatient(patientId, patientData) {
  const updates = [];
  const values = [];

  for (const key in patientData) {
      updates.push(`${key} = ?`);
      values.push(patientData[key]);
  }

  values.push(patientId); // להוסיף את ה-ID של המטופל לסוף

  await pool.query(`
      UPDATE Patients
      SET ${updates.join(', ')}
      WHERE PatientID = ?
  `, values);
}
/*
export async function deletePatient(patientId) {
  await pool.query(`
      DELETE FROM Patients
      WHERE PatientID = ?
  `, [patientId]);
}*/
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


