import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MeetingSummary = () => {
  const [patientName, setPatientName] = useState('');
  const [patientID, setPatientID] = useState('');
  const [meetingContent, setMeetingContent] = useState('');
  const [summary, setSummary] = useState('');
  const [imagePath, setImagePath] = useState('');
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImagePath(file); // Set file name, not path
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
    try {
      const response = await fetch(`/addsession/${PatientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           // Get current date
          SessionContent: meetingContent,
          SessionSummary: summary,
          ImagePath: imagePath, // Send image path
        }),
      });
      if (response.ok) {
        console.log('Meeting summary submitted successfully');
        navigate(`/home`);
      } else {
        console.log('Error submitting the meeting summary');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Patient Name:
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Patient ID:
        <input
          type="text"
          value={patientID}
          onChange={(e) => setPatientID(e.target.value)}
        />
      </label>
      <label>
        Meeting Content:
        <textarea
          value={meetingContent}
          onChange={(e) => setMeetingContent(e.target.value)}
        />
      </label>
      <br />
      <label>
        Summary (short):
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </label>
      <br />
      <label>
        Upload Image:
        <input type="file" onChange={handleImageUpload} />
      </label>
      <br />
      <button type="submit">Submit Summary</button>
    </form>
  );
};

export default MeetingSummary;
