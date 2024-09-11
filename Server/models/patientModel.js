// patientModel.js
import db from '../databasemy.js';

// Retrieve all patients
export const getAllPatients = async () => {
    const query = 'SELECT * FROM Patients';
    const [rows] = await db.query(query);
    return rows;
};

// Retrieve patient by ID
export const getPatient = async (id) => {
    const query = 'SELECT * FROM Patients WHERE ID = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

// Retrieve patients by therapist ID
export const getPatientsByTherapist = async (therapistID) => {
    const query = `
        SELECT p.* FROM Patients p
        JOIN TherapistPatients tp ON p.ID = tp.PatientID
        WHERE tp.TherapistID = ?
    `;
    const [rows] = await db.query(query, [therapistID]);
    return rows;
};

// Create a new patient
export const createPatient = async (Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource, TherapistID) => {
    const query = `
        INSERT INTO Patients (Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource]);

    const patientID = result.insertId;

    const insertTherapistPatientQuery = `
        INSERT INTO TherapistPatients (TherapistID, PatientID)
        VALUES (?, ?)
    `;
    await db.query(insertTherapistPatientQuery, [TherapistID, patientID]);

    return patientID;
};

// Update an existing patient
export const updatePatient = async (id, { Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource }) => {
    const query = `
        UPDATE Patients
        SET Name = ?, Age = ?, IDNumber = ?, MaritalStatus = ?, SiblingPosition = ?, SiblingsNumber = ?, EducationalInstitution = ?, Medication = ?, ReferralSource = ?
        WHERE ID = ?
    `;
    const [result] = await db.query(query, [Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource, id]);
    return result;
};

// Check if a patient exists by ID number
export const isPatientExists = async (IDNumber) => {
    const query = 'SELECT ID AS patientID, COUNT(*) AS exists FROM Patients WHERE IDNumber = ?';
    const [rows] = await db.query(query, [IDNumber]);
    return rows[0];
};
