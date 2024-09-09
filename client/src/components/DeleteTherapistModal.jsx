import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteTherapistModal = ({ TherapistID, onClose }) => {
    const navigate = useNavigate();
    const [therapistsList, setTherapistsList] = useState([]);
    const [selectedTherapistID, setSelectedTherapistID] = useState('');
    const [conflictingAppointments, setConflictingAppointments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTherapistsList = async () => {
            try {
                const response = await fetch(`http://localhost:8080/therapists`);
                if (!response.ok) {
                    throw new Error('Failed to fetch therapists list');
                }
                const data = await response.json();
                setTherapistsList(data);
            } catch (error) {
                setError('Error loading therapists list');
                console.error('Error fetching therapists:', error);
            }
        };

        fetchTherapistsList();
    }, []);

    const handleTransferPatients = async () => {
        try {
            const response = await fetch(`http://localhost:8080/check-conflicts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldTherapistID: TherapistID,
                    newTherapistID: selectedTherapistID,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to check appointment conflicts');
            }

            const data = await response.json();
            if (data.conflicts.length > 0) {
                setConflictingAppointments(data.conflicts);
            }

            await transferPatients(); // Ensure this function handles the actual transfer
        } catch (error) {
            setError('Error checking for conflicts');
            console.error('Error:', error);
        }
    };

    const transferPatients = async () => {
        try {
            const response = await fetch(`http://localhost:8080/transfer-patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldTherapistID: TherapistID,
                    newTherapistID: selectedTherapistID,
                }),
            });

            if (!response.ok) {
                throw new Error('Error transferring patients');
            }
        } catch (error) {
            setError('Error transferring patients');
            console.error('Error:', error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedTherapistID) {
                await handleTransferPatients();
            }
            await deleteTherapist();
            navigate('/therapists');
        } catch (error) {
            setError('Error during transfer or deletion');
            console.error('Error:', error);
        }
    };

    const deleteTherapist = async () => {
        try {
            const response = await fetch(`http://localhost:8080/therapist/${TherapistID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error deleting therapist');
            }
        } catch (error) {
            throw new Error('Error deleting therapist');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Transfer or Delete Patients</h3>
                {error && <p className="error">{error}</p>}
                <p>Do you want to transfer the patients to another therapist or delete them?</p>
                <select value={selectedTherapistID} onChange={(e) => setSelectedTherapistID(e.target.value)}>
                    <option value="">Select Therapist</option>
                    {therapistsList.map((therapist) => (
                        <option key={therapist.TherapistID} value={therapist.TherapistID}>
                            {therapist.Name}
                        </option>
                    ))}
                </select>
                {conflictingAppointments.length > 0 && (
                    <div className="conflicts">
                        <h4>Conflicting Appointments:</h4>
                        <ul>
                            {conflictingAppointments.map((appt) => (
                                <li key={appt.id}>
                                    {appt.AppointmentsDay} at {appt.AppointmentsTime}: {appt.PatientName}
                                </li>
                            ))}
                        </ul>
                        <p>Please make sure the doctor makes a new appointment</p>
                    </div>
                )}
                <button onClick={handleConfirmDelete}>Confirm</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteTherapistModal;
