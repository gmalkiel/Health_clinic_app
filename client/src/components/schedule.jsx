import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);

const Schedule = ({ userType, username }) => {
    const [appointments, setAppointments] = useState([]);
    const [view, setView] = useState('week'); // תצוגת ברירת מחדל לשבוע
    const [timezone, setTimezone] = useState('local'); // אפשרות לקביעת אזור זמן
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // בקשת פגישות מהשרת בהתאם לסוג המשתמש (מנהל או מטפל)
        const fetchAppointments = async () => {
            try {
                let response;
                if (userType === 'admin') {
                    response = await fetch(`http://localhost:8080/apointments`); // לכל הפגישות
                } else {
                    res =  await fetch(`http://localhost:8080/user/${username}`);
                    if (response.ok) {
                        const user = await response.json();
                        TherapistId = user.TherapistId;
                    }
                    else{
                        const errorText = await response.text(); 
                        console.error('Fetch error:', errorText);
                        setError(errorText);
                    }
                    response = await fetch(`http://localhost:8080/apointments/${TherapistId}`); // לפגישות של המטפל בלבד
                }
                const data = await response.json();
                const appointmentsData = data.map((appt) => ({
                    title: userType === 'admin' ? `${appt.PatientName} with ${appt.TherapistName}` : `${appt.PatientName}`,
                    start: new Date(appt.StartDateTime),
                    end: new Date(appt.EndDateTime),
                }));
                setAppointments(appointmentsData);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments();
    }, [userType, username]);

    return (
        <div style={{ height: '700px' }}>
            <Calendar
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                defaultView={view}
                views={['month', 'week', 'day']}
                onView={(view) => setView(view)}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                style={{ height: 600 }}
            />
            {userType === 'therapist' && (
                <button
                    onClick={() => window.location.href = '/new-appointment'}
                    style={{ marginTop: '20px', padding: '10px 20px' }}
                >
                    הוסף פגישה חדשה
                </button>
            )}
        </div>
    );
};

export default Schedule;
