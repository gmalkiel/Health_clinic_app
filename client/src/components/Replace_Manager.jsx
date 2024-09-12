import React, { useState } from 'react';
import '../css/AddTherapist.css'; // נשתמש באותו קובץ CSS לעיצוב דומה
import { useNavigate } from 'react-router-dom';

const Replace_Manager = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    IDNumber: ''
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
//בדיקה האם כבר קיי מנהל במערכת
  const checkManagerExists = async () => {
    try {
      const response = await fetch(`http://localhost:8080/managers`);
      if (response.ok) {
        // קיים מנהל במערכת כבר
        debugger;
        const data = await response.json();
        return  data.IDNumber;
      } else if (response.status === 404) {
        // המנהל לא קיים
        return false;
      } else {
        // שגיאה אחרת
        throw new Error('Failed to check manager existence');
      }
    } catch (error) {
      console.error('Error checking manager existence:', error);
      return false;
    }
  };
 const deleteExistManager = async (Id) => {
        try {
            const response = await fetch(`http://localhost:8080/manager/${Id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(error);
            }
        } catch (error) {
            throw new Error(error);
        }
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // בדיקת קיום המנהל במערכת
    const managerExists = await checkManagerExists();

    if (managerExists) {
      let res = deleteExistManager(managerExists);
      
    } 
      try {
        const response = await fetch('http://localhost:8080/manager', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          setSuccess('Manager added successfully');
          console.log('Manager added:', result);
          navigate(`/home/admin/${formData.Name}`);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error adding manager');
          console.error('Error adding manager:', errorData.error);
        }
      } catch (error) {
        setError('Error adding manager');
        console.error('Error:', error);
      }
    
  };

  return (
    <div className="add-therapist-form"> {/* שימוש באותו סגנון כמו בהוספת מטפל */}
      <h2>Add New Manager</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>ID Number:</label>
          <input
            type="text"
            name="IDNumber"
            value={formData.IDNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button className="addT" type="submit">Add Manager</button>
      </form>
    </div>
  );
};

export default Replace_Manager;
