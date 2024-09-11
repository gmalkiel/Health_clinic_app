import * as db from '../database.js';

// Retrieve all therapists
export const getAllTherapists = async () => {
    const query = 'SELECT * FROM Therapists';
    const [rows] = await db.query(query);
    return rows;
};

// Retrieve therapist by ID
export const getTherapist = async (id) => {
    const query = 'SELECT * FROM Therapists WHERE ID = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

// Retrieve therapist by username
export const getTherapistByUsername = async (username) => {
    const query = 'SELECT * FROM Therapists WHERE UserName = ?';
    const [rows] = await db.query(query, [username]);
    return rows[0];
};

// Create a new therapist
export const createTherapist = async (Name, IDNumber, DateOfBirth, Email, UserName, T_Password, Phone, Gender, Address) => {
    const query = `
        INSERT INTO Therapists (Name, IDNumber, DateOfBirth, Email, UserName, T_Password, Phone, Gender, Address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [Name, IDNumber, DateOfBirth, Email, UserName, T_Password, Phone, Gender, Address]);
    return result.insertId;
};

// Update an existing therapist
export const updateTherapist = async (id, Name, Email, Phone) => {
    const query = `
        UPDATE Therapists
        SET Name = ?, Email = ?, Phone = ?
        WHERE ID = ?
    `;
    const [result] = await db.query(query, [Name, Email, Phone, id]);
    return result;
};

// Delete a therapist
export const deleteTherapist = async (id) => {
    const query = 'DELETE FROM Therapists WHERE ID = ?';
    const [result] = await db.query(query, [id]);
    return result;
};
