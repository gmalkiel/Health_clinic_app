import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/AddRestOfPatient.css'; // Import the CSS file

const AddRestOfPatient = () => {
    const { PatientID } = useParams(); // Get PatientID from the URL
    const [patient, setPatient] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        TreatmentGoals: "",
        Diagnoses: "",
        RiskLevel: "",
        Medication: "",
        AppointmentTime: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/patient/${PatientID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch patient details');
                }
                const data = await response.json();
                setPatient(data);
    
                // Format the date for the datetime-local input
                const formattedDate = data.AppointmentTime ? new Date(data.AppointmentTime).toISOString().slice(0, 16) : "";
    
                setFormData({
                    TreatmentGoals: data.TreatmentGoals || "",
                    Diagnoses: data.Diagnoses || "",
                    RiskLevel: data.RiskLevel || "",
                    Medication: data.Medication || "",
                    AppointmentTime: formattedDate
                });
            } catch (error) {
                setError('Error loading patient details');
                console.error('Error fetching patient:', error);
            }
        };
    
        if (PatientID) {
            fetchPatientDetails();
        }
    }, [PatientID]);
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        // Convert the date and time to a VARCHAR format (e.g., "YYYY-MM-DD HH:MM:SS")
        //const formattedAppointmentTime = new Date(formData.AppointmentTime).toISOString().slice(0, 19).replace('T', ' ');

        try {
            const response = await fetch(`http://localhost:8080/patient/${PatientID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData}),
            });
            if (!response.ok) throw new Error('Failed to update patient');
            const res = await fetch(`http://localhost:8080/therapist/${PatientID}/therapist`);
            const data = await res.json();
          
            console.log("Patient updated successfully:", data);
            navigate(`/home/therapist/${data.UserName}`);
            debugger;
        } catch (error) {
            console.error("Error updating patient:", error);
            setError("Failed to update patient.");
        }
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="add-rest-of-patient-container">
            <h2>Update Patient Details</h2>
            <form onSubmit={handleSubmit} className="add-rest-of-patient-form">
                <div className="form-group">
                    <label htmlFor="Name">Name:</label>
                    <p>{patient?.Name}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="IDNumber">ID Number:</label>
                    <p>{patient?.PatientID}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="Age">Age:</label>
                    <p>{patient?.Age}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="MaritalStatus">Marital Status:</label>
                    <p>{patient?.MaritalStatus}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="SiblingPosition">Sibling Position:</label>
                    <p>{patient?.SiblingPosition}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="SiblingsNumber">Siblings Number:</label>
                    <p>{patient?.SiblingsNumber}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="EducationalInstitution">Educational Institution:</label>
                    <p>{patient?.EducationalInstitution}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="ReferralSource">Referral Source:</label>
                    <p>{patient?.ReferralSource}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="RemainingSessions">Remaining Sessions:</label>
                    <p>{patient?.RemainingSessions}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="RemainingPayment">Remaining Payment:</label>
                    <p>{patient?.RemainingPayment}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="TreatmentGoals">Treatment Goals:</label>
                    <input
                        type="text"
                        id="TreatmentGoals"
                        name="TreatmentGoals"
                        value={formData.TreatmentGoals}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Diagnoses">Diagnoses:</label>
                    <input
                        type="text"
                        id="Diagnoses"
                        name="Diagnoses"
                        value={formData.Diagnoses}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="RiskLevel">Risk Level:</label>
                    <input
                        type="text"
                        id="RiskLevel"
                        name="RiskLevel"
                        value={formData.RiskLevel}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Medication">Medication:</label>
                    <input
                        type="text"
                        id="Medication"
                        name="Medication"
                        value={formData.Medication}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="AppointmentTime">Appointment Time:</label>
                    <input
                        type="datetime-local"
                        id="AppointmentTime"
                        name="AppointmentTime"
                        value={formData.AppointmentTime}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="submit-button">Update Patient</button>
            </form>
        </div>
    );
};
export default AddRestOfPatient;
