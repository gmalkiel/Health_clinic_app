import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/Schedule.css'; // נניח שיש לך קובץ CSS

const localizer = momentLocalizer(moment);

// פונקציה ליצירת פגישות מחזוריות
function generateRecurringAppointments(startDate, endDate, frequency, appointmentDetails) {
    const appointments = [];
    let currentDate = moment(startDate);
  
    while (currentDate.isBefore(endDate)) {
      appointments.push({
        ...appointmentDetails,
        start: currentDate.toDate(),
        end: currentDate.add(1, 'hour').toDate(), // משך הפגישה הוא שעה
      });
      currentDate.add(7, 'days'); // יצירת פגישות כל 7 ימים
    }
  
    return appointments;
  }
const Schedule = ({ userType, username }) => {
    const [appointments, setAppointments] = useState([]);
    const [view, setView] = useState('month'); // תצוגת ברירת מחדל לשבוע
    const [currentDate, setCurrentDate] = useState(new Date());
    const [error, setError] = useState(''); // הגדרת משתנה error

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                let response;
                if (userType === 'admin') {
                    response = await fetch(`http://localhost:8080/apointments`); // לכל הפגישות
                } else {
                    let res = await fetch(`http://localhost:8080/user/${username}`);
                    if (res.ok) {
                        const user = await res.json();
                        const TherapistId = user.TherapistId;
                        response = await fetch(`http://localhost:8080/apointments/${TherapistId}`); // לפגישות של המטפל בלבד
                    } else {
                        const errorText = await res.text(); 
                        console.error('Fetch error:', errorText);
                        setError(`Fetch error: ${errorText}`);
                        return;
                    }
                }
                
                if (response.ok) {
                    const data = await response.json();
                    const appointmentsData = data.flatMap((appt) => 
                        generateRecurringAppointments(
                            new Date(appt.StartDateTime),
                            new Date(appt.EndDateTime),
                            'weekly', // מחזור שבועי, שנה לפי הצורך
                            {
                                title: userType === 'admin' ? `${appt.PatientName} with ${appt.TherapistName}` : `${appt.PatientName}`,
                                start: new Date(appt.StartDateTime),
                                end: new Date(appt.EndDateTime),
                            }
                        )
                    );
                    setAppointments(appointmentsData);
                } else {
                    const errorText = await response.text();
                    console.error('API error:', errorText);
                    setError(`API error: ${errorText}`);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError('Failed to fetch appointments');
            }
        };
        fetchAppointments();
    }, [userType, username]);

    return (
        <div className="calendar-container">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Calendar
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                defaultView={view}
                views={['month']}
                onView={(view) => setView(view)}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.title.includes('with') ? 'lightblue' : 'lightgreen',
                        color: 'black'
                    }
                })}
                components={{
                    event: ({ event }) => (
                        <span>
                            {event.title}
                            <div>{moment(event.start).format('MMM D, YYYY h:mm A')}</div> {/* פרטים נוספים */}
                        </span>
                    )
                }}
                style={{ height: '100%' }}
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
