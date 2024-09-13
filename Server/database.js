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

//maneger func
export async function getManger(id) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM Managers
  WHERE ManagerID = ?
  `, [id])
  return rows[0]
}
export async function getManger_(Id) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM Managers
  WHERE IDNumber = ?
  `, [Id])
  return rows[0]
}
export async function getMangers(){
  const [rows] = await pool.query(`
    SELECT * 
    FROM Managers`)
    return rows[0]
}
export async function createManager(Name, IDNumber){
  const [result] = await pool.query(`
    INSERT INTO Managers (Name, IDNumber)
    VALUES (?, ?)
    `, [Name, IDNumber])
    const id = result.insertId;
    return getManger(id);
}
export async function deleteManager(ID) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    // Disable SQL_SAFE_UPDATES
    await connection.query(`
      SET SQL_SAFE_UPDATES = 0;
    `);

    // Perform the DELETE operation
    await connection.query(`
      DELETE FROM Managers
      WHERE IDNumber = ?
    `, [ID]);

    // Commit the transaction if everything succeeded
    await connection.commit();
  } catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    throw new Error(`Failed to delete from Manager: ${error.message}`);
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
}

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

export async function createPatient(Name, Age, IDNumber, MaritalStatus = null, SiblingPosition = null, SiblingsNumber = null, EducationalInstitution = null, Medication = null, ReferralSource = null, TherapistID, RemainingPayment = null, RemainingSessions = null, AppointmentTime = null) {
  const connection = await pool.getConnection();

  try {
    // המרת הערכים למספרים
    const age = parseInt(Age);
    const siblingPosition = SiblingPosition !== null ? parseInt(SiblingPosition) : null;
    const siblingsNumber = SiblingsNumber !== null ? parseInt(SiblingsNumber) : null;
    const remainingPayment = RemainingPayment !== null ? parseFloat(RemainingPayment) : null;

    // הכנסת המטופל לטבלת Patients
    const [result] = await connection.query(`
      INSERT INTO Patients (
        Name, 
        Age, 
        IDNumber, 
        MaritalStatus, 
        SiblingPosition, 
        SiblingsNumber, 
        EducationalInstitution, 
        Medication, 
        ReferralSource, 
        RemainingSessions, 
        RemainingPayment, 
        AppointmentTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [Name, age, IDNumber, MaritalStatus, siblingPosition, siblingsNumber, EducationalInstitution, Medication, ReferralSource, RemainingSessions, remainingPayment, AppointmentTime]);

    // שמירת ה־PatientID שנוצר
    const patientId = result.insertId;

    // הוספת רשומה לטבלת TherapistPatients לקשר בין מטפל למטופל
    await connection.query(`
      INSERT INTO TherapistPatients (TherapistID, PatientID)
      VALUES (?, ?)
    `, [TherapistID, patientId]);
    let message =  `תור למטופל: ${Name}, עם מספר תעודת זהות: ${IDNumber}.`
    addMessage(TherapistID,message);
    // החזרת המטופל שהתווסף
    return getPatient(patientId);
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}


export async function getTherapistByPatientId(patientId) {
  const connection = await pool.getConnection();
  try {
      // שאילתת SQL לשליפת המטפל לפי מזהה המטופל
      const [rows] = await connection.execute(
          `SELECT Therapists.* 
           FROM TherapistPatients 
           JOIN Therapists ON TherapistPatients.TherapistID = Therapists.TherapistID
           WHERE TherapistPatients.PatientID = ?`,
          [patientId]
      );

      // בדיקה אם נמצא מטפל
      if (rows.length > 0) {
          return rows[0]; // החזרת המטפל הראשון שנמצא
      } else {
          throw new Error('No therapist found for the given patient ID');
      }
  } catch (error) {
      console.error('Error fetching therapist:', error);
      throw error; // זריקת שגיאה במקרה של בעיה
  } finally {
      connection.release(); // שחרור חיבור למסד הנתונים
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
    debugger;
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
    debugger;
    const [day, time] = patientData.AppointmentTime.split('T');
    // הוספת שניות (MySQL דורש את פורמט 'HH:MM:SS' עבור TIME)
    const timeWithSeconds = `${time}:00`;
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
          console.log('With values:', [therapistID, day, timeWithSeconds]);
          debugger;
          therapistID = parseInt(therapistID, 10);
          const [[result]] = await pool.query(checkQuery, [therapistID, day, timeWithSeconds]);

          if (result.count > 0) {
              throw new Error('An appointment with the same day and time already exists for this therapist');
          }

          // Insert the new appointment if no conflicts
          const insertQuery = `
              INSERT INTO Appointments (TherapistID, PatientID, AppointmentsDay, AppointmentsTime, Location)
              VALUES (?, ?, ?, ?, ?)
          `;
          console.log('Executing query:', insertQuery);
          console.log('With values:', [therapistID, patientIdInt, day, timeWithSeconds, '']); // Add Location if needed

          await pool.query(insertQuery, [therapistID, patientIdInt, day, timeWithSeconds, '']);
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
//פונקציה זו תביא לי מפגש בהתאם לתאריך והמטופל שמשויך אליה
export async function getSession_( SessionDate ,PatientID) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM Sessions
  WHERE SessionDate = ?
  AND  PatientID = ?
  `, [SessionDate,PatientID]);
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

/*export async function createNewSession(PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImagePath) {
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
}*/

export async function createNewSession(PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImagePath) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Step 1: Insert the new session
    let sessionId;
    try {
      const imagePath = path.resolve(ArtworkImagePath);
      const imageData = fs.readFileSync(imagePath); // Read the image data as binary
      const [result] = await connection.query(`
        INSERT INTO Sessions (SessionContent, SessionSummary, PatientID, ArtworkImage, SessionDate)
        VALUES (?, ?, ?, ?, ?)
      `, [SessionContent, SessionSummary, PatientID, imageData, SessionDate]);
      sessionId = result.insertId;
    } catch (error) {
      console.error('Error inserting new session:', error.message);
      await connection.rollback();
      throw new Error('Failed to insert new session');
    }

    // Step 2: Get the therapist for the patient
    let therapistID;
    try {
      const [therapistRow] = await connection.query(`
        SELECT TherapistID
        FROM TherapistPatients
        WHERE PatientID = ?
      `, [PatientID]);

      if (therapistRow.length === 0) {
        throw new Error('No therapist found for the patient');
      }

      therapistID = therapistRow[0].TherapistID;
    } catch (error) {
      console.error('Error fetching therapist:', error.message);
      await connection.rollback();
      throw new Error('Failed to fetch therapist for the patient');
    }

    // Step 3: Get the session price for the therapist
    let sessionPrice;
    try {
      const [therapist] = await connection.query(`
        SELECT SessionPrice
        FROM Therapists
        WHERE TherapistID = ?
      `, [therapistID]);

      if (therapist.length === 0) {
        throw new Error('No session price found for the therapist');
      }

      sessionPrice = therapist[0].SessionPrice;
    } catch (error) {
      console.error('Error fetching session price:', error.message);
      await connection.rollback();
      throw new Error('Failed to fetch session price for the therapist');
    }

    // Step 4: Update the patient's remaining sessions and balance
    try {
      await connection.query(`
        UPDATE Patients
        SET remainingSessions = remainingSessions - 1,
            remainingPayment = remainingPayment + ?
        WHERE PatientID = ?
      `, [sessionPrice, PatientID]);
    } catch (error) {
      console.error('Error updating patient balance:', error.message);
      await connection.rollback();
      throw new Error('Failed to update patient balance');
    }

    // Step 5: Check if the patient's remainingPayment is greater than 0
    try {
      const [patient] = await connection.query(`
        SELECT Name, remainingPayment
        FROM Patients
        WHERE PatientID = ?
      `, [PatientID]);

      const patientName = patient[0].Name;
      const remainingPayment = patient[0].remainingPayment;

      if (remainingPayment > 0) {
        const paymentAlertMessage = `התראת תשלום למטופל ${patientName} (ID: ${PatientID}) - יתרת תשלום: ${remainingPayment} ש"ח.`;

        // Step 6: Insert the payment alert message for the therapist
        await connection.query(`
          INSERT INTO Messages (TherapistID, Content)
          VALUES (?, ?)
        `, [therapistID, paymentAlertMessage]);
      }
    } catch (error) {
      console.error('Error handling payment alert:', error.message);
      await connection.rollback();
      throw new Error('Failed to handle payment alert');
    }

    await connection.commit();
    return getSession(sessionId); // Assuming you have a getSession function to retrieve the session

  } catch (error) {
    await connection.rollback();
    console.error('Error in createNewSession:', error.message);
    throw error;
  } finally {
    connection.release();
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
    // 1. Delete appointments related to the therapist
    try {
      await connection.query(`
        DELETE FROM Appointments
        WHERE TherapistID = ?
      `, [therapistID]);
    } catch (error) {
      await connection.rollback();
      throw new Error(`Failed to delete appointments: ${error.message}`);
    }

    // 2. Delete the therapist from TherapistPatients table
    try {
      await connection.query(`
        DELETE FROM TherapistPatients
        WHERE TherapistID = ?
      `, [therapistID]);
    } catch (error) {
      await connection.rollback();
      throw new Error(`Failed to delete from TherapistPatients: ${error.message}`);
    }

    // 3. Delete messages related to the therapist
    try {
      await connection.query(`
        DELETE FROM Messages
        WHERE TherapistID = ?
      `, [therapistID]);
    } catch (error) {
      await connection.rollback();
      throw new Error(`Failed to delete messages: ${error.message}`);
    }

    // 4. Delete the therapist from Therapists table
    let result;
    try {
      [result] = await connection.query(`
        DELETE FROM Therapists
        WHERE TherapistID = ?
      `, [therapistID]);
    } catch (error) {
      await connection.rollback();
      throw new Error(`Failed to delete therapist: ${error.message}`);
    }

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

/* יש להוסיף הודעה למטפל שאליו הועברו המטופלים בה כתוב קבע פגישות עבור המטופלים החדשים במידת הצורך פונקציות בכדי לבצע מחיקה נכונה של מטפל*/
export async function transferPatients(oldTherapistID, newTherapistID) {
  const [result] = await pool.query(`
    UPDATE TherapistPatients tp
    SET tp.TherapistID = ?
    WHERE tp.TherapistID = ?
  `, [newTherapistID, oldTherapistID]);
  addMessage(newTherapistID,"הוא עברו אליך מטופלים חדשים עליך לעדכן פגישות בהתאם")
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
