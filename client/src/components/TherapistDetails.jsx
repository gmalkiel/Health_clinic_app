import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AddTherapist.css'; // Reuse the CSS file for styling

const TherapistDetails = ({ therapist }) => {
    const navigate = useNavigate();

    if (!therapist) return <div>Select a therapist to see details.</div>;

    const handleViewPatients = () => {
        // Navigate to the page/component to view patients
        navigate(`/patients/${therapist.TherapistID}`);
    };

    const handleDelete = () => {
        // Navigate to the page/component for deleting the therapist
        navigate(`/delete-therapist/${therapist.TherapistID}`);
    };

    return (
        <div className="add-therapist-form">
            <h2>Therapist Details</h2>
            <div className="form-group">
                <label>Name:</label>
                <p>{therapist.Name}</p>
            </div>
            <div className="form-group">
                <label>Email:</label>
                <p>{therapist.Email}</p>
            </div>
            <div className="form-group">
                <label>Phone:</label>
                <p>{therapist.Phone}</p>
            </div>
            <div className="form-group">
                <label>Address:</label>
                <p>{therapist.Address}</p>
            </div>
            <div className="form-group">
                <label>Gender:</label>
                <p>{therapist.Gender}</p>
            </div>
            <button onClick={handleViewPatients}>View Patients</button>
            <button onClick={handleDelete}>Delete Therapist</button>
        </div>
    );
};

export default TherapistDetails;
