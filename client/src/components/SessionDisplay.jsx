import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/SessionDisplay.css';

const SessionDisplay = () => {
  const { SessionID } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/session/${SessionID}`);
        if (!response.ok) throw new Error('Failed to fetch session data');
        
        const data = await response.json();
        setSessionData(data);

        if (data.ArtworkImage && data.ArtworkImage.data) {
          // Convert Buffer to Uint8Array
          const byteArray = new Uint8Array(data.ArtworkImage.data);

          // Create Blob from byteArray
          const blob = new Blob([byteArray], { type: 'image/jpeg' });

          // Create URL from Blob
          const imageUrl = URL.createObjectURL(blob);

          setImageUrl(imageUrl);
        }

        // Fetch patient details
        const patientResponse = await fetch(`http://localhost:8080/patient/${data.PatientID}`);
        if (!patientResponse.ok) throw new Error('Failed to fetch patient details');

        const patientData = await patientResponse.json();
        setPatientName(patientData.Name);

      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
  }, [SessionID]);

  if (!sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="session-display-container">
      <h2>Session Details</h2>
      <p><strong>Session Date:</strong> {new Date(sessionData.SessionDate).toLocaleString()}</p>
      <p><strong>Session Content:</strong> {sessionData.SessionContent}</p>
      <p><strong>Session Summary:</strong> {sessionData.SessionSummary}</p>

      {/* Display patient name and link to patient details page */}
      <p>
        <strong>Patient Name:</strong>{' '}
        <Link to={`/PatientDetails/${sessionData.PatientID}`}>{patientName || 'Loading...'}</Link>
      </p>

      {/* Display artwork image */}
      {imageUrl ? (
        <div className="artwork-container">
          <h3>Artwork</h3>
          <img 
            src={imageUrl} 
            alt="Patient's Artwork" 
            className="artwork-image" 
          />
        </div>
      ) : (
        <p>No artwork available for this session.</p>
      )}
    </div>
  );
};

export default SessionDisplay;

/*import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/SessionDisplay.css';

const SessionDisplay = () => {
  const { SessionID } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/session/${SessionID}`);
        if (!response.ok) throw new Error('Failed to fetch session data');
        
        const data = await response.json();
        setSessionData(data);

        if (data.ArtworkImage && data.ArtworkImage.data) {
          // Convert Buffer to Uint8Array
          const byteArray = new Uint8Array(data.ArtworkImage.data);

          // Create Blob from byteArray
          const blob = new Blob([byteArray], { type: 'image/jpeg' });

          // Create URL from Blob
          const imageUrl = URL.createObjectURL(blob);

          setImageUrl(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
  }, [SessionID]);

  if (!sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="session-display-container">
      <h2>Session Details</h2>
      <p><strong>Session Date:</strong> {new Date(sessionData.SessionDate).toLocaleString()}</p>
      <p><strong>Session Content:</strong> {sessionData.SessionContent}</p>
      <p><strong>Session Summary:</strong> {sessionData.SessionSummary}</p>
*/
      {/* Link to patient details page */}/*
      <p>
        <strong>Patient ID:</strong>{' '}
        <Link to={`/PatientDetails/${sessionData.PatientID}`}>{sessionData.PatientID}</Link>
      </p>
*/
      {/* Display artwork image */}/*
      {imageUrl ? (
        <div className="artwork-container">
          <h3>Artwork</h3>
          <img 
            src={imageUrl} 
            alt="Patient's Artwork" 
            className="artwork-image" 
          />
        </div>
      ) : (
        <p>No artwork available for this session.</p>
      )}
    </div>
  );
};

export default SessionDisplay;
*/