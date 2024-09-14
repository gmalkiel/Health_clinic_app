import * as db from '../databasemy.js';

export const getSessionById = async (req, res) => {
    const { id } = req.params;
    try {
        const session = await db.getSession(id);
        if (session) {
            res.send(session);
        } else {
            res.status(404).send('Session not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving session');
    }
};

export const getSessionsByPatient = async (req, res) => {
    const { patientID } = req.params;
    try {
        const sessions = await db.getSessionsByPatient(patientID);
        res.send(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving sessions for patient');
    }
};

export async function createNewSession(PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImagePath) {
    const connection = await pool.getConnection();
    await connection.beginTransaction(); // התחלת טרנזקציה
  
    try {
      const imagePath = path.resolve(ArtworkImagePath); 
      const imageData = fs.readFileSync(imagePath);
      const sessionId = await createSession(connection, {
        SessionContent,
        SessionSummary,
        PatientID,
        ArtworkImage: imageData,
        SessionDate
      });
  
      const [therapistRow] = await connection.query(`
        SELECT TherapistID FROM TherapistPatients WHERE PatientID = ?
      `, [PatientID]);
  
      if (therapistRow.length === 0) {
        throw new Error('לא נמצא מטפל עבור המטופל');
      }
  
      const therapistID = therapistRow[0].TherapistID;
  
      const [therapist] = await connection.query(`
        SELECT SessionPrice FROM Therapists WHERE TherapistID = ?
      `, [therapistID]);
  
      const sessionPrice = therapist[0].SessionPrice;
  
      await connection.query(`
        UPDATE Patients
        SET remainingSessions = remainingSessions - 1, remainingPayment = remainingPayment + ?
        WHERE PatientID = ?
      `, [sessionPrice, PatientID]);
  
      const [patient] = await connection.query(`
        SELECT Name, remainingPayment FROM Patients WHERE PatientID = ?
      `, [PatientID]);
  
      if (patient[0].remainingPayment > 0) {
        const paymentAlertMessage = `התראת תשלום למטופל ${patient[0].Name} (ID: ${PatientID}) - יתרת תשלום: ${patient[0].remainingPayment} ש"ח.`;
        
        await connection.query(`
          INSERT INTO Messages (TherapistID, Content) VALUES (?, ?)
        `, [therapistID, paymentAlertMessage]);
      }
  
      await connection.commit();
      return getSession(sessionId); 
  
    } catch (error) {
      await connection.rollback();
      console.error('שגיאה במהלך יצירת הסשן:', error.message);
      throw error; 
    } finally {
      connection.release();
    }
  }

export const updateSession = async (req, res) => {
    const { id } = req.params;
    const { SessionContent, SessionSummary, ArtworkImage } = req.body;
    try {
        const updatedSession = await db.updateSession(id, SessionContent, SessionSummary, ArtworkImage);
        res.send(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating session');
    }
};
