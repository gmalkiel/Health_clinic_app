import express from "express";
import cors from "cors";
import * as db from "../Server/database.js";
//import { getAllTherapists, getTherapist, createTherapist, getTherapistByUsername } from "../Server/database.js"

const app = express()
app.use(express.json())
app.use(express.static('client'));

// Configure CORS to allow requests from your frontend URL
app.use(cors({
    origin: 'http://localhost:5173' // Adjust the port if needed
}));

app.use(express.json());
app.get("/therapists", async (req, res) => {
    const therapists = await db.getAllTherapists()
    res.send(therapists)
})
/*add for calender */
app.get("/apointments", async (req, res) => {
    const apointments = await db.getAllAppointments()
    res.send(apointments)
})
app.get("/apointments/:id", async (req, res) => {
    const id = req.params.id;
    const apointments = await db.getAppointments(id)
    res.send(apointments)
})
app.get("/therapist/:id", async (req, res) => {
    const id = req.params.id
    const therapist = await db.getTherapist(id)
    res.send(therapist)
})

app.get("/user/:username", async (req, res) => {
    const username = req.params.username;
    try {
        const user = await db.getTherapistByUsername(username); 
        if (user) {
            res.status(200).json(user); // Send user details as JSON
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user details');
    }
});

app.post("/therapist", async (req, res) => {
    const {Name, IDNumber, DateOfBirth, Email, Phone} = req.body
    const therapist = await db.createTherapist(Name, IDNumber, DateOfBirth, Email, Phone)
    res.status(201).send(therapist)
})

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

app.delete("/patient/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // מחיקת המטופל ממסד הנתונים כולל מהטבלה המחברת
        await db.deletePatient(id);
        res.status(200).send(`Patient with ID ${id} and all related data have been deleted.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting patient");
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
