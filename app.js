import express from "express"
import { getAllTherapists, getTherapist, createTherapist } from "./database.js"

const app = express()

app.get("/therapists", async (req, res) => {
    const therapists = await getAllTherapists()
    res.send(therapists)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})


/*function sayHello(name){
    console.log('hello ' + name);
}
sayHello('galit');*/