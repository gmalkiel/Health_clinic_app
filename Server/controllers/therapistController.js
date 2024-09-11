import * as db from '../databasemy.js';

export const getAllTherapists = async (req, res) => {
    try {
        const therapists = await db.getAllTherapists();
        res.send(therapists);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving therapists');
    }
};

export const getTherapistById = async (req, res) => {
    const { id } = req.params;
    try {
        const therapist = await db.getTherapist(id);
        if (therapist) {
            res.send(therapist);
        } else {
            res.status(404).send('Therapist not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving therapist');
    }
};

export const getTherapistByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await db.getTherapistByUsername(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user details');
    }
};

export const createTherapist = async (req, res) => {
    const { Name, IDNumber, DateOfBirth, Email, UserName, T_Password, Phone, Gender, Adress } = req.body;
    try {
        const therapist = await db.createTherapist(Name, IDNumber, DateOfBirth, Email, UserName, T_Password, Phone, Gender, Adress);
        res.status(201).json(therapist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding therapist');
    }
};

export const updateTherapist = async (req, res) => {
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
};

export const deleteTherapist = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.deleteTherapist(id);
        if (result.affectedRows > 0) {
            res.send(`Therapist with ID ${id} has been deleted`);
        } else {
            res.status(404).send('Therapist not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting therapist');
    }
};
