import * as patientModel from '../models/patientModel.js';

export const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await patientModel.getPatient(id);
    if (patient) {
      res.send(patient);
    } else {
      res.status(404).send('Patient not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving patient');
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await patientModel.getAllPatients();
    res.send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving patients');
  }
};

export const getPatientsByTherapist = async (req, res) => {
  const { therapistID } = req.params;
  try {
    const patients = await patientModel.getPatientsByTherapist(therapistID);
    res.send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving patients for therapist');
  }
};

export const createPatient = async (req, res) => {
  const { Name, Age, IDNumber, MaritalStatus, SiblingPosition, SiblingsNumber, EducationalInstitution, Medication, ReferralSource, TherapistID } = req.body;
  try {
    if (!Name || !Age || !IDNumber || !TherapistID) {
      return res.status(400).send('Missing required fields');
    }
    const newPatientId = await patientModel.createPatient(
      Name, Age, IDNumber, MaritalStatus || null, SiblingPosition || null, 
      SiblingsNumber || null, EducationalInstitution || null, Medication || null, 
      ReferralSource || null, TherapistID
    );
    res.status(201).send({ patientId: newPatientId });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const checkPatientExists = async (req, res) => {
  const idNumber = req.params.id;
  if (!idNumber) {
    return res.status(400).json({ error: 'IDNumber is required' });
  }
  try {
    const exists = (await patientModel.isPatientExists(idNumber)).exists;
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking if patient exists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPatientIdByIdNumber = async (req, res) => {
  const idNumber = req.params.id;
  if (!idNumber) {
    return res.status(400).json({ error: 'IDNumber is required' });
  }
  try {
    const patientID = (await patientModel.isPatientExists(idNumber)).patientID;
    res.status(200).json({ patientID });
  } catch (error) {
    console.error('Error checking if patient exists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePatient = async (req, res) => {
  try {
    await patientModel.updatePatient(req.params.id, req.body);
    res.status(200).json({ message: 'Patient updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
