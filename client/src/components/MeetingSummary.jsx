import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MeetingSummary.css'; // Import the CSS file for styling

const MeetingSummary = () => {
  const [patientName, setPatientName] = useState('');
  const [patientID, setPatientID] = useState('');
  const [meetingContent, setMeetingContent] = useState('');
  const [summary, setSummary] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function getPatientId(idNumber) {
    try {
      const response = await fetch(`http://localhost:8080/patients/getId/${idNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient ID');
      }
      const data = await response.json();
      return data.patientID;
    } catch (error) {
      console.error('Error fetching patient ID:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const PatientId = await getPatientId(patientID);
    const formData = new FormData();
    formData.append('SessionContent', meetingContent);
    formData.append('SessionSummary', summary);
    formData.append('PatientID', PatientId);
    if (imageFile) {
      formData.append('Image', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:8080/addsession`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        console.log('Meeting summary submitted successfully');
        const res = await fetch(`http://localhost:8080/therapist/${PatientId}/therapist`);
        const data = await res.json();
        console.log('Patient updated successfully:', data);
        navigate(`/home/therapist/${data.UserName}`);
      } else {
        console.log('Error submitting the meeting summary');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="meeting-summary-form">
        <h2>סיכום פגישה</h2>
        <label>
          Name:
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </label>
        <label>
          ID Number:
          <input
            type="text"
            value={patientID}
            onChange={(e) => setPatientID(e.target.value)}
            required
          />
        </label>
        <label>
          Meeting Content:
          <textarea
            value={meetingContent}
            onChange={(e) => setMeetingContent(e.target.value)}
            required
          />
        </label>
        <label>
          Summary:
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </label>
        <label className="image-upload-label">
          Upload Image:
          <div className="image-upload-container">
            <input
              type="file"
              onChange={handleImageUpload}
              className="image-input"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">+</div>
            )}
          </div>
        </label>
        <button type="submit" className="submit-button">Submit Summary</button>
      </form>
    </div>
  );
};

export default MeetingSummary;
