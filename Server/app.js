import express from "express";
import cors from "cors";
import * as db from "./database.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { validatePatient, validateTherapist } from './validationMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({
  origin: 'http://localhost:5173' // Adjust the port if needed
}));
app.use(express.json());
app.use(express.static('client'));
app.listen(8080, () => {
  console.log('Server is running on port 8080')
})

app.use('/patients', validatePatient);
//app.use('/therapists', validateTherapist);

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // מנסים להגדיר את הנתיב לשמירת הקובץ
      cb(null, path.join(__dirname, 'img')); // Directory where files will be saved
    } catch (error) {
      // במקרה של שגיאה, נתפוס את השגיאה ונדווח עליה
      console.error("Error in destination function:", error);
      cb(error, null); // מחזירים את השגיאה ל-callback
    }
  },
  filename: function (req, file, cb) {
    try {
      // מנסים לשמור את הקובץ עם השם המקורי שלו
      cb(null, file.originalname);  // Keep the original file name
    } catch (error) {
      // במקרה של שגיאה, נתפוס את השגיאה ונדווח עליה
      console.error("Error in filename function:", error);
      cb(error, null); // מחזירים את השגיאה ל-callback
    }
  }
});

const upload = multer({ storage: storage });

app.post('/addsession', upload.single('Image'), async (req, res) => {
  const { SessionContent, SessionSummary, PatientID } = req.body;
  const ImagePath = req.file ? req.file.path : null;

  try {
    const currentDate = new Date();
    const newSession = await db.createNewSession(PatientID, currentDate, SessionContent, SessionSummary, ImagePath);
    res.status(200).send(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).send(error
      
    );
  }
});

/*GET */
app.get("/manager/:id", async (req, res) => {
  const id = req.params.id;
  const manager = await db.getManger(id);
  res.send(manager);
});
app.get("/manager_/:id", async (req, res) => {
  const id = req.params.id;
  const manager = await db.getManger_(id);
  res.send(manager);
});
app.get("/managers", async (req, res) => {
  const manager = await db.getMangers();
  res.send(manager);
});
app.get("/therapists", async (req, res) => {
  const therapists = await db.getAllTherapists();
  res.send(therapists);
});

app.get("/therapist/:id", async (req, res) => {
  const id = req.params.id;
  const therapist = await db.getTherapist(id);
  res.send(therapist);
});
app.get("/user/:username", async (req, res) => {
  const username = req.params.username;
  try {
      const user = await db.getTherapistByUsername(username); 
      if (user) {
          res.status(200).json(user); 
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching user details');
  }
});
//Patient  GET
app.get("/patient/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const patient = await db.getPatient(id);
      if (patient) {
          res.send(patient);
      } else {
          res.status(404).send('Patient not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving patient');
  }
});
app.get("/therapist/:PatientId/therapist", async (req, res) => {
  const { PatientId } = req.params;
  try {
      const therapist = await db.getTherapistByPatientId(PatientId);
      if (therapist) {
          res.send(therapist);
      } else {
          res.status(404).send('therapist not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving therapist');
  }
});
app.get("/patients", async (req, res) => {
  try {
      const patients = await db.getAllPatients();
      res.send(patients);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving patients');
  }
});
app.get("/therapist/:therapistID/patients", async (req, res) => {
  const { therapistID } = req.params;

  try {
      const patients = await db.getPatientsByTherapist(therapistID);
      res.send(patients);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving patients for therapist');
  }
});

app.get("/patient/:patientID/sessions", async (req, res) => {
  const { patientID } = req.params;

  try {
      const sessions = await db.getSessionsByPatient(patientID);
      res.send(sessions);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving sessions for patient');
  }
});

app.get("/session/:id", async (req, res) => {
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
});
app.get("/session_/:id", async (req, res) => {
  const { id } = req.params;
  const {date} = req.body;
  try {
      const session = await db.getSession_(date,id);
      if (session) {
          res.send(session);
      } else {
          res.status(404).send('Session not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving session');
  }
});

app.put('/patient/:id', async (req, res) => {
    try {
    
        res.status(200).json({message:"upasete sucess"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE endpoint for deleting a therapist
app.delete('/therapist/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.deleteTherapist(id);
    if (result.affectedRows > 0) {
      res.send(`Therapist with ID ${id} has been deleted`);
    } else {
      res.status(404).send('Therapist not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`${error}`);
  }
});
//Sessions functions 

/*add for calender */
app.get("/appointments", async (req, res) => {
  const apointments = await db.getAllAppointments()
  res.send(apointments)
})

app.get("/appointments/:id", async (req, res) => {
  const id = req.params.id;
  const appointments = await db.getTherapistAppointments(id)
  res.send(appointments)
})

app.get("/appointment/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const appointment = await db.getAppointment(id);
      if (appointment) {
          res.send(appointment);
      } else {
          res.status(404).send('Appointment not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving appointment');
  }
});

/*POST*/
app.post("/therapist", async (req, res) => {
  const { Name, IDNumber, DateOfBirth, Email, UserName, T_Password,Phone,Gender, Adress} = req.body;

  try {
  
    // Create new therapist if no conflict
    const therapist = await db.createTherapist(Name, IDNumber, DateOfBirth, Email, UserName, T_Password,Phone,Gender, Adress);
    console.log(therapist);
    res.status(200).json(therapist);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding therapist' });
  }
});
app.post("/manager", async (req, res) => {
  const {Name,IDNumber} = req.body;

  try {
  
    // Create new therapist if no conflict
    const manager = await db.createManager(Name,IDNumber);
    res.status(200).json(manager);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding manager' });
  }
});

app.post('/addPatient', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing');
  }

  const { Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource, RemainingPayment, RemainingSessions, TherapistID } = req.body;

  try {
    // בדיקה האם כל השדות החיוניים קיימים
    if (!TherapistID || !Name || !Age || !IDNumber) {
      return res.status(400).send('Missing required fields');
    }

    // המרת RemainingPayment ו- RemainingSessions לערכים נדרשים (אם לא סופקו, יהיו NULL)
    const newPatientId = await db.createPatient(
      Name,
      Age,
      IDNumber,
      MaritalStatus || null,
      SiblingPosition || null,
      SiblingsNumber || null,
      EducationalInstitution || null,
      Medication || null,
      ReferralSource || null,
      TherapistID,
      RemainingPayment !== undefined ? RemainingPayment : null, // טיפול במקרים בהם RemainingPayment אינו מוגדר
      RemainingSessions !== undefined ? RemainingSessions : null // טיפול במקרים בהם RemainingSessions אינו מוגדר
    );

    res.status(200).send({ patientId: newPatientId });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


/*מחיקת מטפל בדיקות */
// Function to check for appointment conflicts
app.post("/check-conflicts", async (req, res) => {
  const { oldTherapistID, newTherapistID } = req.body;
  
  try {
    // Query to get appointments for both therapists
    const oldTherapistAppointments = await db.getTherapistAppointments(oldTherapistID);
    const newTherapistAppointments = await db.getTherapistAppointments(newTherapistID);
    
    // Check for conflicts (you could refine this based on specific criteria like date overlap)
    const conflicts = oldTherapistAppointments.filter(oldAppt => 
      newTherapistAppointments.some(newAppt => 
        oldAppt.Date === newAppt.Date && oldAppt.Time === newAppt.Time
      )
    );

    res.json({ conflicts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error checking appointment conflicts');
  }
});

app.post("/transfer-patients", async (req, res) => {
  const { oldTherapistID, newTherapistID } = req.body;

  try {
    // Update the patients to be assigned to the new therapist
    const result = await db.transferPatients(oldTherapistID, newTherapistID);
    res.status(200).json({ message: 'Patients transferred successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error transferring patients');
  }
});

/*check Duplicate Patients */
app.get("/patients/check/:id", async (req, res) => {
  const idNumber =  req.params.id;
  if (!idNumber) {
    return res.status(400).json({ error: 'IDNumber is required' });
  }

  try {
    const exists = (await db.isPatientExists(idNumber)).exists; 
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking if patient exists:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // החזר שגיאה במקרה של בעיה
  }
});

app.get("/patients/getId/:id", async (req, res) => {
  const idNumber =  req.params.id;
  if (!idNumber) {
    return res.status(400).json({ error: 'IDNumber is required' });
  }

  try {
    const patientID = (await db.isPatientExists(idNumber)).patientID; 
    res.status(200).json({ patientID });
  } catch (error) {
    console.error('Error checking if patient exists:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // החזר שגיאה במקרה של בעיה
  }
});

/*UPDATE */
app.put("/therapist/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Email, Phone } = req.body;

  try {
    const updatedTherapist = await db.updateTherapist(id, Name, Email, Phone);
    if (updatedTherapist) {
      res.send(updatedTherapist);
    } else {
      res.status(404).send('Therapist not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating therapist');
  }
});

app.put("/session/:id", async (req, res) => {
  const { id } = req.params;
  const { SessionContent, SessionSummary, ArtworkImage } = req.body;

  try {
      const updatedSession = await db.updateSession(id, SessionContent, SessionSummary, ArtworkImage);
      res.send(updatedSession);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error updating session');
  }
});
/*DELETE*/
app.delete("/therapist/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.deleteTherapist(id);
    if (result.affectedRows > 0) {
      res.send(`Therapist with ID ${id} has been deleted`);
    } else {
      res.status(404).send('Therapist not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting therapist');
  }
});
app.post('/message', async (req, res) => {
  const { therapistID, content } = req.body;

  if (!therapistID || !content) {
      return res.status(400).send('TherapistID and content are required');
  }

  try {
      await db.addMessage(therapistID, content);
      res.status(201).send('Message added successfully');
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.delete('/message/:id', async (req, res) => {
  const messageID = parseInt(req.params.id, 10);

  if (isNaN(messageID)) {
      return res.status(400).send('Invalid message ID');
  }

  try {
      await db.deleteMessage(messageID);
      res.status(200).send('Message deleted successfully');
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.get('/messages/:therapistID', async (req, res) => {
  const therapistID = parseInt(req.params.therapistID, 10);

  if (isNaN(therapistID)) {
      return res.status(400).send('Invalid therapist ID');
  }

  try {
      const messages = await db.getMessagesForTherapist(therapistID);
      res.status(200).json(messages);
  } catch (error) {
      res.status(500).send(error.message);
  }
});
app.delete("/manager/:IDNumber", async (req, res) => {
  const { IDNumber } = req.params;

  try {
    const result = await db.deleteManager(IDNumber);
    if (result.affectedRows > 0) {
      res.send(`Manager with ID ${IDNumber} has been deleted`);
    } else {
      res.status(404).send('Maneger not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//General functions
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
