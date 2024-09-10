import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/AddRestOfPatient.css'; // Import the CSS file


const AddRestOfPatient = () => {
    const { PatientID } = useParams(); // Get PatientID from the URL
    const [patient, setPatient] = useState(null);
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
                const response = await fetch(`http://localhost:8080/patients/${PatientID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch patient details');
                }
                const data = await response.json();
                setPatient(data);
                setFormData({
                    TreatmentGoals: data.TreatmentGoals || "",
                    Diagnoses: data.Diagnoses || "",
                    RiskLevel: data.RiskLevel || "",
                    Medication: data.Medication || "",
                    AppointmentTime: data.AppointmentTime || ""
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch(`http://localhost:8080/patients/${PatientID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Patient updated successfully:", data);
            setError("");
        })
        .catch((error) => {
            console.error("Error updating patient:", error);
            setError("Failed to update patient.");
        });
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
                        type="text"
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
