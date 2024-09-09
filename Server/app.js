import express from "express";
import cors from "cors";
import * as db from "../Server/database.js";

const app = express();
app.use(express.json());
app.use(express.static('client'));

app.use(cors({
  origin: 'http://localhost:5173' // Adjust the port if needed
}));

app.get("/therapists", async (req, res) => {
  const therapists = await db.getAllTherapists();
  res.send(therapists);
});

app.get("/therapist/:id", async (req, res) => {
  const id = req.params.id;
  const therapist = await db.getTherapist(id);
  res.send(therapist);
});

app.post("/therapist", async (req, res) => {
  const { Name, IDNumber, DateOfBirth, Email, UserName, T_Password, Adress, Gender, Phone } = req.body;

  try {
    // Check if username, email or IDNumber already exists
    const existingTherapistByUsername = await db.getTherapistByUsername(UserName);
    if (existingTherapistByUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const existingTherapistByEmail = await db.getTherapistByEmail(Email);
    if (existingTherapistByEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const existingTherapistByID = await db.getTherapistByIDNumber(IDNumber);
    if (existingTherapistByID) {
      return res.status(400).json({ error: 'ID Number already exists' });
    }

    // Create new therapist if no conflict
    const therapist = await db.createTherapist(Name, IDNumber, DateOfBirth, Email, UserName, T_Password, Adress, Gender, Phone);
    res.status(201).json(therapist);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding therapist' });
  }
});

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

//Patient functions

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
/*
app.delete("/patient/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.deletePatient(id);
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

app.delete("/patient/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.deletePatient(id);
        res.status(200).send(`Patient with ID ${id} and all related data have been deleted.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting patient");
    }
});*/

//Appointments functions

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

//General functions
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})

app.use(express.static('client'));
