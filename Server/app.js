import express from "express";
import cors from "cors";
import * as db from "../Server/database.js";

const app = express();


app.use(cors({
  origin: 'http://localhost:5173' // Adjust the port if needed
}));
/*GET */
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

app.post("/session/:PatientID", async (req, res) => {
  const {SessionContent, SessionSummary, ArtworkImage } = req.body;
  const { PatientID } = req.params

  try {
      const currentDate = new Date();
      const newSession = await db.createSession(PatientID, currentDate, SessionContent, SessionSummary, ArtworkImage );
      res.status(201).send(newSession);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error creating session');
  }
});
app.post("/Patient", async (req, res) => {
  const { Name, Age, MaritalStatus, SiblingPosition, SiblingsNumber, IDNumber,EducationalInstitution,ReferralSource,  RemainingPayment, TherapistID,RemainingSessions} = req.body;
  try {
    
      const patient = await db.createPatient(Name, Age, MaritalStatus, SiblingPosition, SiblingsNumber, IDNumber,EducationalInstitution,ReferralSource,  RemainingPayment, TherapistID,RemainingSessions);
      res.status(200).send(patient);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error creating session');
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
app.delete("/therapist/:id", async (req, res) => {///////////////
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
//General functions
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
app.use(express.json());
app.use(express.static('client'));
app.listen(8080, () => {
  console.log('Server is running on port 8080')
})

app.use(express.static('client'));
