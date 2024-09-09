import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/TherapistDetails .css'; // Import the CSS file

const TherapistDetails = () => {
    const { TherapistID } = useParams(); // Get TherapistID from the URL
    const navigate = useNavigate();
    const [therapist, setTherapist] = useState(null); // To store the therapist details
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTherapistDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/therapist/${TherapistID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch therapist details');
                }
                const data = await response.json();
                setTherapist(data); // Set the therapist details
            } catch (error) {
                setError('Error loading therapist details');
                console.error('Error fetching therapist:', error);
            }
        };

        if (TherapistID) {
            fetchTherapistDetails();
        }
    }, [TherapistID]); // This effect runs whenever TherapistID changes

    const handleViewPatients = () => {
        // Navigate to the page/component to view patients
        navigate(`/patients/${TherapistID}`);
    };

    const handleDelete = () => {
        // Navigate to the page/component for deleting the therapist
        navigate(`/delete-therapist/${TherapistID}`);
    };

    if (!TherapistID) return <div className="error">Select a therapist to see details.</div>;

    if (error) return <div className="error">{error}</div>;

    if (!therapist) return <div className="error">Loading therapist details...</div>;

    return (
        <div className="therapist-details">
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
                <p>{therapist.Adress}</p> {/* Note: correct to Address if needed */}
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
