import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUser, FaUsers, FaClipboardList, FaCalendarAlt, FaUserCog, FaEnvelope } from 'react-icons/fa';
import { useUser } from '../components/UserContext'; // Import useUser hook
import '../css/Navigation.css';

const Navigation = () => {
  const { user } = useUser(); // Get user from context
  const [therapistId, setTherapistId] = useState(null); // Initialize state for TherapistId
  const [error, setError] = useState(null); // Initialize state for error

  useEffect(() => {
    const fetchTherapistDetails = async () => {
      if (user.username) {
        try {
          const response = await fetch(`http://localhost:8080/user/${user.username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch therapist details');
          }
          const data = await response.json();
          setTherapistId(data.TherapistID); // Set the therapist details
        } catch (error) {
          setError('Error loading therapist details');
          console.error('Error fetching therapist:', error);
        }
      }
    };

    fetchTherapistDetails();
  }, [user.username]); // Dependencies array includes user.username

  if (!user) return null; // Return null or some placeholder if user is not available

  return (
    <div className="side-navigation">
      <ul>
        {user.manger ? (
          <>
            <li>
              <Link to="/replaceManager">
                <FaUserCog className="icon" /> החלפת מנהל
              </Link>
            </li>
            <li>
              <Link to="/therapists">
                <FaUsers className="icon" /> הצגת מטפלים
              </Link>
            </li>
            <li>
              <Link to="/patients">
                <FaClipboardList className="icon" /> הצגת מטופלים
              </Link>
            </li>
            <li>
              <Link to={`/home/admin/${user.username}`}>
                <FaCalendarAlt className="icon" /> לוח זמנים
              </Link>
            </li>
            
          </>
        ) : (
          <>
            <li>
              <Link to={`/patients/${therapistId}`}>
                <FaClipboardList className="icon" /> הצגת מטופלים
              </Link>
            </li>
            <li>
              <Link to={`/home/therapist/${user.username}`}>
                <FaCalendarAlt className="icon" /> לוח זמנים
              </Link>
            </li>
            <li>
              <Link to={`/messages/${therapistId}`}>
                <FaEnvelope className="icon" /> הודעות
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
