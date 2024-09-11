import * as db from '../database.js';

export const getSessionById = async (req, res) => {
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
};

export const getSessionsByPatient = async (req, res) => {
    const { patientID } = req.params;
    try {
        const sessions = await db.getSessionsByPatient(patientID);
        res.send(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving sessions for patient');
    }
};

export const createSession = async (req, res) => {
    const { PatientID } = req.params;
    const { SessionContent, SessionSummary, ImagePath, CurrentDate } = req.body;
    try {
        const newSession = await db.createSession(PatientID, CurrentDate, SessionContent, SessionSummary, ImagePath);
        res.status(200).send(newSession);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating session');
    }
};

export const updateSession = async (req, res) => {
    const { id } = req.params;
    const { SessionContent, SessionSummary, ArtworkImage } = req.body;
    try {
        const updatedSession = await db.updateSession(id, SessionContent, SessionSummary, ArtworkImage);
        res.send(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating session');
    }
};
