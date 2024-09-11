import * as db from '../database.js';

// Retrieve all appointments
export const getAllAppointments = async () => {
    const query = 'SELECT * FROM Appointments';
    const [rows] = await db.query(query);
    return rows;
};

// Retrieve appointments by therapist ID
export const getTherapistAppointments = async (therapistID) => {
    const query = `
        SELECT * FROM Appointments
        WHERE TherapistID = ?
    `;
    const [rows] = await db.query(query, [therapistID]);
    return rows;
};

// Retrieve appointment by ID
export const getAppointment = async (id) => {
    const query = 'SELECT * FROM Appointments WHERE ID = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

// Create a new appointment
export const createAppointment = async (PatientID, TherapistID, AppointmentTime) => {
    const query = `
        INSERT INTO Appointments (PatientID, TherapistID, AppointmentTime)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(query, [PatientID, TherapistID, AppointmentTime]);
    return result.insertId;
};

// Update an existing appointment
export const updateAppointment = async (id, AppointmentTime) => {
    const query = `
        UPDATE Appointments
        SET AppointmentTime = ?
        WHERE ID = ?
    `;
    const [result] = await db.query(query, [AppointmentTime, id]);
    return result;
};
