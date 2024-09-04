import express from "express"
import { getAllTherapists, getTherapist, createTherapist } from "../Server/database.js"

const app = express()

app.get("/therapists", async (req, res) => {
    const therapists = await getAllTherapists()
    res.send(therapists)
})

app.get("/therapist/:id", async (req, res) => {
    const id = req.params.id
    const therapist = await getTherapist(id)
    res.send(therapist)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})
