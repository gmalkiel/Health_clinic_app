import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa'; // human icon
import '../css/Patients.css'; // for styling


const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:8080/patients');
        if (!response.ok) throw new Error('נכשלה בקבלת נתונים על מטופלים');
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error('שגיאה בקבלת המטופלים:', error);
        setError('נכשלה טעינת המטופלים. אנא נסה שוב.');
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    // סינון לפי גיל אם נבחר פילטר
    let filtered = patients.filter((patient) =>
      patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (ageFilter) {
      filtered = filtered.filter((patient) => patient.Age === parseInt(ageFilter, 10));
    }

    // מיון לפי השדה שנבחר
    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
      });
    }

    setFilteredPatients(filtered);
  }, [searchTerm, sortField, ageFilter, patients]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="patient-list-container">
      {/* אזור החיפוש, הסינון והמיון */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="חפש לפי שם..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="סנן לפי גיל..."
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
        />
        <select onChange={(e) => setSortField(e.target.value)}>
          <option value="">מיין לפי...</option>
          <option value="Name">שם</option>
          <option value="Age">גיל</option>
          <option value="IDNumber">ת.ז</option>
        </select>
      </div>

      {/* רשימת המטופלים */}
      {filteredPatients.map((patient) => (
        <div key={patient.PatientID} className="patient-row">
          <FaUser className="user-icon" />
          <span><strong>שם:</strong> {patient.Name}</span>
          <span><strong>ת.ז:</strong> {patient.IDNumber}</span>
          <span><strong>גיל:</strong> {patient.Age}</span>
          <span><strong>טלפון:</strong> {patient.Phone}</span>
          <span><strong>אימייל:</strong> {patient.Mail}</span>
        </div>
      ))}
    </div>
  );
};

export default PatientList;
