import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // human icon
import '../css/Patients.css'; // for styling

const Patients = () => {
  const { TherapistID } = useParams(); // Get TherapistID from the URL
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchPatients = async () => {
      if (!TherapistID) {
        try {
          const response = await fetch('http://localhost:8080/patients');
          if (!response.ok) throw new Error('Failed to fetch patients');
          const data = await response.json();
          setPatients(data);
          setFilteredPatients(data);
        } catch (error) {
          console.error('Error fetching patients:', error);
          setError('Failed to load patients. Please try again.');
        }
      } else {
        try {
          const response = await fetch(`http://localhost:8080/therapist/${TherapistID}/patients`);
          if (!response.ok) throw new Error('Failed to fetch patients');
          const data = await response.json();
          setPatients(data);
          setFilteredPatients(data);
        } catch (error) {
          console.error('Error fetching patients:', error);
          setError('Failed to load patients. Please try again.');
        }
      }
    };
    fetchPatients();
  }, [TherapistID]);

  useEffect(() => {
    let filtered = patients.filter((patient) =>
      patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (ageFilter) {
      filtered = filtered.filter((patient) => patient.Age === parseInt(ageFilter, 10));
    }

    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
      });
    }

    setFilteredPatients(filtered);
  }, [searchTerm, sortField, ageFilter, patients]);

  const handleRowClick = (patientId) => {
    debugger;
    //const PatientID = patients.at(patientId).PatientID;
    // Navigate to the patient details page
    navigate(`/PatientDetails/${patientId}`);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="patient-list-container">
      {/* Search, filter, and sort controls */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Filter by age..."
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
        />
        <select onChange={(e) => setSortField(e.target.value)}>
          <option value="">Sort by...</option>
          <option value="Name">Name</option>
          <option value="Age">Age</option>
          <option value="IDNumber">ID Number</option>
        </select>
      </div>

      {/* Patient list */}
      {filteredPatients.map((patient) => (
        <div
          key={patient.PatientID}
          className="patient-row"
          onClick={() => handleRowClick(patient.PatientID)}
        >
          <FaUser className="user-icon" />
          <span><strong>שם:</strong> {patient.Name}</span>
          <span><strong>ת.ז:</strong> {patient.IDNumber}</span>
          <span><strong>גיל:</strong> {patient.Age}</span>
          <span><strong>מצב משפחתי:</strong> {patient.MaritalStatus}</span>
          <span><strong>מוסד לימודים:</strong> {patient.EducationalInstitution}</span>
        </div>
      ))}
    </div>
  );
};

export default Patients;
