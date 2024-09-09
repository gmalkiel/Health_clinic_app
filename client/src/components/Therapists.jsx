import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaSortUp, FaSortDown } from 'react-icons/fa'; // Import sort icons
import '../css/Therapists.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Therapists = () => {
    const [therapists, setTherapists] = useState([]);
    const [filteredTherapists, setFilteredTherapists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() => {
        const fetchTherapists = async () => {
            try {
                const response = await fetch('http://localhost:8080/therapists');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTherapists(data);
                setFilteredTherapists(data);
            } catch (error) {
                console.error('Failed to fetch therapists', error);
                setError('Failed to load therapists. Please try again.');
            }
        };

        fetchTherapists();
    }, []);

    useEffect(() => {
        let result = therapists;

        // Filter by gender
        if (genderFilter) {
            result = result.filter(therapist => therapist.Gender === genderFilter);
        }

        // Search by name
        if (searchTerm) {
            result = result.filter(therapist => 
                therapist.Name.toLowerCase().includes(searchTerm.toLowerCase())
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

        setFilteredTherapists(result);
    }, [searchTerm, genderFilter, sortOrder, therapists]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGenderFilter = (e) => {
        setGenderFilter(e.target.value);
    };

    const handleSort = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleRowClick = (therapist) => {
        // Navigate to the therapist details page
        
        navigate(`/therapist/${therapist.TherapistID}`);

    };
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="therapists-container">
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
            <div className="therapists-table-container">
                <table className="therapists-table">
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
                        {filteredTherapists.map((therapist) => (
                            <tr key={therapist.TherapistID} className="table-row"   onClick={() => handleRowClick(therapist)} >
                                <td className="icon-cell"><FaUserAlt size={24} color="#388e3c" /></td>
                                <td>{therapist.Name}</td>
                                <td>{therapist.Email}</td>
                                <td>{therapist.Phone}</td>
                                <td>{therapist.Adress}</td>
                                <td>{therapist.Gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Therapists;
