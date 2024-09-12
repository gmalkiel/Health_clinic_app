import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUser, FaUsers, FaClipboardList, FaCalendarAlt, FaUserCog } from 'react-icons/fa'; // אייקונים
import '../css/Navigation.css';

const Navigation = () => {
  return (
    <div className="side-navigation">
      <ul>
        <li>
          <Link to="/addTherapist">
            <FaUserPlus className="icon" /> הוספת מטפל
          </Link>
        </li>
        <li>
          <Link to="/addPatient">
            <FaUser className="icon" /> הוספת מטופל
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
          <Link to="/schedule">
            <FaCalendarAlt className="icon" /> לוח זמנים
          </Link>
        </li>
        <li>
          <Link to="/replaceManager">
            <FaUserCog className="icon" /> החלפת מנהל
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
