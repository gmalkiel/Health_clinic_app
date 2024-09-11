import db from '../database.js';

// Retrieve session by ID
export const getSession = async (id) => {
    const query = 'SELECT * FROM Sessions WHERE ID = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

// Retrieve sessions by patient ID
export const getSessionsByPatient = async (patientID) => {
    const query = 'SELECT * FROM Sessions WHERE PatientID = ?';
    const [rows] = await db.query(query, [patientID]);
    return rows;
};

// Create a new session
export const createSession = async (PatientID, Date, SessionContent, SessionSummary, ImagePath) => {
    const query = `
        INSERT INTO Sessions (PatientID, Date, SessionContent, SessionSummary, ImagePath)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [PatientID, Date, SessionContent, SessionSummary, ImagePath]);
    return result.insertId;
};

// Update an existing session
export const updateSession = async (id, SessionContent, SessionSummary, ArtworkImage) => {
    const query = `
        UPDATE Sessions
        SET SessionContent = ?, SessionSummary = ?, ImagePath = ?
        WHERE ID = ?
    `;
    const [result] = await db.query(query, [SessionContent, SessionSummary, ArtworkImage, id]);
    return result;
};
