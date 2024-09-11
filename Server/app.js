import express from "express";
import cors from "cors";
import therapistRoutes from "./routes/therapistRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.use(express.json());
app.use(express.static('client'));

app.use(cors({
  origin: 'http://localhost:5173' // Adjust the port if needed
}));

// Routes
app.use('/therapists', therapistRoutes);
app.use('/patients', patientRoutes);
app.use('/sessions', sessionRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/messages', messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
