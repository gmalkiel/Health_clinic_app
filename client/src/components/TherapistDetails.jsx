import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteTherapistModal from '../components/DeleteTherapistModal'
import '../css/TherapistDetails .css'; // Import the CSS file

const TherapistDetails = () => {
    const { TherapistID } = useParams(); // Get TherapistID from the URL
    const navigate = useNavigate();
    const [therapist, setTherapist] = useState(null); // To store the therapist details
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Handle modal visibility
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
        // Open the modal for delete confirmation
        setShowModal(true);
    };

    if (!TherapistID) return <div className="error">Select a therapist to see details.</div>;

    if (error) return <div className="error">{error}</div>;

    if (!therapist) return <div className="error">Loading therapist details...</div>;

    return (
        <div className="therapist-details">
        <h2>Therapist Details</h2>
        {error && <div className="error">{error}</div>}
        {therapist && (
            <>
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
                    <p>{therapist.Adress}</p>
                </div>
                <div className="form-group">
                    <label>Gender:</label>
                    <p>{therapist.Gender}</p>
                </div>
                <button onClick={handleViewPatients}>הצגת מטופלים</button>
                <button onClick={handleDelete}>מחיקת מטפל</button>
            </>
        )}

        {showModal && (
            <DeleteTherapistModal
                TherapistID={TherapistID}
                onClose={() => setShowModal(false)} // Close modal when done
            />
        )}
    </div>

    );
};
export default TherapistDetails;