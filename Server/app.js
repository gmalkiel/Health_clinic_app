import express from "express"
import * as db from "../Server/database.js"
//import { getAllTherapists, getTherapist, createTherapist, getTherapistByUsername } from "../Server/database.js"

const app = express()

app.use(express.json())

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

app.get("/therapist/username/:username", async (req, res) => {
    const username = req.params.username;
    const therapist = await db.getTherapistByUsername(username);
    if (therapist) {
        res.send(therapist);
    } else {
        res.status(404).send('Therapist not found');
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
