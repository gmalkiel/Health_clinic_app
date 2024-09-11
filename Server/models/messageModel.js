import * as db from '../database.js';

// Retrieve messages for a specific therapist
export const getMessagesForTherapist = async (therapistID) => {
    const query = 'SELECT * FROM Messages WHERE TherapistID = ?';
    const [rows] = await db.query(query, [therapistID]);
    return rows;
};

// Add a new message
export const addMessage = async (therapistID, content) => {
    const query = `
        INSERT INTO Messages (TherapistID, Content, Date)
        VALUES (?, ?, NOW())
    `;
    const [result] = await db.query(query, [therapistID, content]);
    return result.insertId;
};

// Delete a message
export const deleteMessage = async (messageID) => {
    const query = 'DELETE FROM Messages WHERE ID = ?';
    const [result] = await db.query(query, [messageID]);
    return result;
};
