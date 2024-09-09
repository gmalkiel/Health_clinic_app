import React, { useState } from 'react';
import '../css/AddTherapist.css'; // Import the CSS file

const AddTherapist = () => {
  const [formData, setFormData] = useState({
    Name: '',
    IDNumber: '',
    DateOfBirth: '',
    Email: '',
    UserName: '',
    T_Password: '',
    Adress: '',
    Gender: '',
    Phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/therapist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess('Therapist added successfully');
        console.log('Therapist added:', result);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error adding therapist');
        console.error('Error adding therapist:', errorData.error);
      }
    } catch (error) {
      setError('Error adding therapist');
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-therapist-form">
      <h2>Add New Therapist</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div className="form-group" key={key}>
            <label>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</label>
            <input
              type={key === 'DateOfBirth' ? 'date' : key === 'Email' ? 'email' : 'text'}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required={key === 'Name' || key === 'IDNumber' || key === 'Phone'}
            />
          </div>
        ))}
        <button type="submit">Add Therapist</button>
      </form>
    </div>
  );
};

export default AddTherapist;
