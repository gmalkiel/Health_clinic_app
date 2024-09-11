import * as appointmentModel from '../models/appointmentModel.js';

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getAllAppointments();
    res.send(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving appointments');
  }
};

export const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await appointmentModel.getAppointment(id);
    if (appointment) {
      res.send(appointment);
    } else {
      res.status(404).send('Appointment not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving appointment');
  }
};

export const getAppointmentsByTherapist = async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await appointmentModel.getAppointmentsByTherapist(id);
    res.send(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving appointments for therapist');
  }
};

export const createAppointment = async (req, res) => {
  const { date, time, therapistId, patientId } = req.body;
  try {
    const newAppointment = await appointmentModel.createAppointment(date, time, therapistId, patientId);
    res.status(201).send(newAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating appointment');
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time, therapistId, patientId } = req.body;
  try {
    const updatedAppointment = await appointmentModel.updateAppointment(id, date, time, therapistId, patientId);
    if (updatedAppointment) {
      res.send(updatedAppointment);
    } else {
      res.status(404).send('Appointment not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating appointment');
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await appointmentModel.deleteAppointment(id);
    if (result.affectedRows > 0) {
      res.send(`Appointment with ID ${id} has been deleted`);
    } else {
      res.status(404).send('Appointment not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting appointment');
  }
};
