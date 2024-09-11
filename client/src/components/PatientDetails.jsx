import React, { useState, useEffect } from "react";
import "../css/AddPatient.css"; // Import the CSS file for styling
import { useNavigate, useParams } from 'react-router-dom';

const PatientDetails = () => {
  const { patientID } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    debugger;
    fetch(`http://localhost:8080/patient/${patientID}`)
      .then((response) => response.json())
      .then((data) => setPatient(data))
      .catch((error) => {
        console.error("Error fetching patient details:", error);
        setError("Failed to fetch patient details.");
      });
  }, [patientID]);

  const handleUpdateClick = () => {
    navigate(`/addRestOfPatient/${patientID}`);
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!patient) {
    return <p>Loading...</p>;
  }

  return (
    <div className="add-patient-container">
      <h2>Patient Details</h2>
      <div className="form-group">
        <label>Name:</label>
        <p>{patient.Name}</p>
      </div>
      <div className="form-group">
        <label>ID:</label>
        <p>{patient.IDNumber}</p>
      </div>
      <div className="form-group">
        <label>Age:</label>
        <p>{patient.Age}</p>
      </div>
      <div className="form-group">
        <label>Marital Status:</label>
        <p>{patient.MaritalStatus}</p>
      </div>
      <div className="form-group">
        <label>Sibling Position:</label>
        <p>{patient.SiblingPosition}</p>
      </div>
      <div className="form-group">
        <label>Siblings Number:</label>
        <p>{patient.SiblingsNumber}</p>
      </div>
      <div className="form-group">
        <label>Educational Institution:</label>
        <p>{patient.EducationalInstitution}</p>
      </div>
      <div className="form-group">
        <label>Referral Source:</label>
        <p>{patient.ReferralSource}</p>
      </div>
      <div className="form-group">
        <label>Payment:</label>
        <p>{patient.Payment}</p>
      </div>
      <div className="form-group">
        <label>Remaining Sessions:</label>
        <p>{patient.RemainingSessions}</p>
      </div>
      <div className="form-group">
        <label>Remaining Payment:</label>
        <p>{patient.RemainingPayment}</p>
      </div>
      <button onClick={handleUpdateClick} className="addP_submit-button">Update Patient</button>
    </div>
  );
};

export default PatientDetails;
