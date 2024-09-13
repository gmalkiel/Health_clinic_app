import React, { useState, useEffect } from "react";
import "../css/AddPatient.css"; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
const AddPatient = () => {
  const [therapists, setTherapists] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Age: "",
    MaritalStatus: "",
    SiblingPosition: "",
    SiblingsNumber: "",
    IDNumber:"",
    EducationalInstitution: "",
    ReferralSource: "",
    Payment: "",
    RemainingPayment: 0,
    TherapistID: "",
    RemainingSessions: 4,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/therapists")
      .then((response) => response.json())
      .then((data) => setTherapists(data))
      .catch((error) => console.error("Error fetching therapists:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const checkPatientExists = async (IDNumber) => {
    try {
        const response = await fetch(`http://localhost:8080/patients/check/${IDNumber}`);
        return await response.json();
    } catch (error) {
        console.error("Error checking patient:", error);
        throw error;
    }
};

const addPatient = async (patientData) => {
    try {
        const response = await fetch("http://localhost:8080/addPatient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patientData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding patient:", error);
       throw error;
       
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const data = await checkPatientExists(formData.IDNumber);
        if (data.exists) {
            setError("Patient already exists in the system.");
        } else {
            const patientData = {
                ...formData,
                RemainingPayment: -formData.Payment,
                RemainingSessions: 4,
            };
            const result = await addPatient(patientData);
            if (typeof result === 'object' && result !== null && 'error' in result) {
              setError(result.error);
            } else {
              console.log("Patient added successfully:", result);
              navigate('/home/admin/Yosi')
            }
            
            //setError("");
        }
    } catch (error) {
        setError("Failed to add patient.");
    }
};

  
  return (
    <div className="add-patient-container">
      <h2>Add Patient</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-patient-form">
        <div className="form-group">
          <label htmlFor="Name">Name:</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Name">ID:</label>
          <input
            type="text"
            id="IDNumber"
            name="IDNumber"
            value={formData.IDNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Age">Age:</label>
          <input
            type="number"
            id="Age"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="MaritalStatus">Marital Status:</label>
          <input
            type="text"
            id="MaritalStatus"
            name="MaritalStatus"
            value={formData.MaritalStatus}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="SiblingPosition">Sibling Position:</label>
          <input
            type="number"
            id="SiblingPosition"
            name="SiblingPosition"
            value={formData.SiblingPosition}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="SiblingsNumber">Siblings Number:</label>
          <input
            type="number"
            id="SiblingsNumber"
            name="SiblingsNumber"
            value={formData.SiblingsNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="EducationalInstitution">Educational Institution:</label>
          <input
            type="text"
            id="EducationalInstitution"
            name="EducationalInstitution"
            value={formData.EducationalInstitution}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ReferralSource">Referral Source:</label>
          <input
            type="text"
            id="ReferralSource"
            name="ReferralSource"
            value={formData.ReferralSource}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Payment">Payment:</label>
          <input
            type="number"
            id="Payment"
            name="Payment"
            value={formData.Payment}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="TherapistID">Therapist:</label>
          <select
            id="TherapistID"
            name="TherapistID"
            value={formData.TherapistID}
            onChange={handleChange}
            required
          >
            <option value="">Select Therapist</option>
            {therapists.map((therapist) => (
              <option key={therapist.TherapistID} value={therapist.TherapistID}>
                {therapist.Name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="addP_submit-button">Add Patient</button>
      </form>
    </div>
  );
};

export default AddPatient;
