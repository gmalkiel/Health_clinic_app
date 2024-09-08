import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaSortUp, FaSortDown } from 'react-icons/fa'; // Import sort icons
import '../css/Patients.css'; // Import the CSS file


const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('http://localhost:8080/patients');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPatients(data);
                setFilteredPatients(data);
            } catch (error) {
                console.error('Failed to fetch patients', error);
                setError('Failed to load patients. Please try again.');
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        let result = patients;

        // Filter by gender
        if (genderFilter) {
            result = result.filter(patient => patient.Gender === genderFilter);
        }

        // Search by name
        if (searchTerm) {
            result = result.filter(patient => 
                patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by name
        result = result.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.Name.localeCompare(b.Name);
            } else {
                return b.Name.localeCompare(a.Name);
            }
        });

        setFilteredPatients(result);
    }, [searchTerm, genderFilter, sortOrder, patients]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGenderFilter = (e) => {
        setGenderFilter(e.target.value);
    };

    const handleSort = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="patients-container">
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="חפש לפי שם..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="filter-input"
                />
                <select value={genderFilter} onChange={handleGenderFilter} className="filter-select">
                    <option value="">מגדר</option>
                    <option value="גבר">גבר</option>
                    <option value="אישה">אישה</option>
                </select>
                <button onClick={handleSort} className="filter-button">
                    מיון לפי שם
                    {sortOrder === 'asc' ? (
                        <FaSortUp size={16} color="#ffffff" />
                    ) : (
                        <FaSortDown size={16} color="#ffffff" />
                    )}
                </button>
            </div>
            <div className="patients-table-container">
                <table className="patients-table">
                    <thead>
                        <tr className="table-header">
                            <th></th>
                            <th>שם</th>
                            <th>מייל</th>
                            <th>טלפון</th>
                            <th>כתובת</th>
                            <th>מגדר</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.PatientID} className="table-row">
                                <td className="icon-cell"><FaUserAlt size={24} color="#388e3c" /></td>
                                <td>{patient.Name}</td>
                                <td>{patient.Email}</td>
                                <td>{patient.Phone}</td>
                                <td>{patient.Adress}</td>
                                <td>{patient.Gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Patients;
