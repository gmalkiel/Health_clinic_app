import express from "express";
import cors from "cors";
import * as db from "../Server/database.js";
//import { getAllTherapists, getTherapist, createTherapist, getTherapistByUsername } from "../Server/database.js"

const app = express()

app.use(express.json())
app.use(express.static('client'));

// Configure CORS to allow requests from your frontend URL
app.use(cors({
    origin: 'http://localhost:5174' // Adjust the port if needed
}));

app.use(express.json());
app.get("/therapists", async (req, res) => {
    const therapists = await db.getAllTherapists()
    res.send(therapists)
})

app.get("/therapist/:id", async (req, res) => {
    const id = req.params.id
    const therapist = await db.getTherapist(id)
    res.send(therapist)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.post("/therapist", async (req, res) => {
    const {Name, IDNumber, DateOfBirth, Email, Phone} = req.body
    const therapist = await db.createTherapist(Name, IDNumber, DateOfBirth, Email, Phone)
    res.status(201).send(therapist)
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


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})

