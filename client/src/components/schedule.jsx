import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/Schedule.css'; 
import { FaPlus } from 'react-icons/fa';

const localizer = momentLocalizer(moment);
function generateRecurringAppointments(startDate, appointmentTime, count, frequency = 7, appointmentDetails) {
    const appointments = [];
    let currentDate = moment(startDate);
    
    while (count) {
        const start = moment(currentDate).set({
            hour: moment(appointmentTime, 'HH:mm').hour(),
            minute: moment(appointmentTime, 'HH:mm').minute(),
            second: 0
        }).toDate();
        
        const end = moment(start).add(1, 'hour').toDate(); // Duration of the appointment is one hour
        
        appointments.push({
            ...appointmentDetails,
            start: start,
            end: end,
        });
        
        currentDate.add(frequency, 'days'); // Generate appointments every 7 days
        count--;
    }

    return appointments;
}
const Schedule = ({ userType, username }) => {
    const [appointments, setAppointments] = useState([]);
    const [view, setView] = useState('month'); // Default view is month
    const [currentDate, setCurrentDate] = useState(new Date());
    const [error, setError] = useState(''); // Error state

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                let response;
                if (userType === 'admin') {
                    response = await fetch(`http://localhost:8080/appointments`); // Fetch all appointments
                } else {
                    let res = await fetch(`http://localhost:8080/user/${username}`);
                    if (res.ok) {
                        const user = await res.json();
                        const TherapistId = user.TherapistID; // Adjust to match new field name
                        response = await fetch(`http://localhost:8080/appointments/${TherapistId}`); // Fetch appointments for the therapist
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
                            new Date(appt.AppointmentsDay), appt.AppointmentsTime, // שילוב תאריך ושעה
                            4,
                            7, // מחזור שבועי
                            {
                                title: userType === 'admin' ? `${appt.PatientName} with ${appt.TherapistName}` : `${appt.PatientName}`,
                                start: new Date(appt.AppointmentsDay + 'T' + appt.AppointmentsTime), // תאריך ושעה
                                end: new Date(new Date(appt.AppointmentsDay + 'T' + appt.AppointmentsTime).getTime() + 60 * 60 * 1000), // הוספת שעה אחת
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
        <>
        <div className="calendar-container">
          
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
             {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
        {/* הכפתור ממוקם בתחתית הדף, מעל הלו"ז */}
        {userType === 'therapist' && (
                <div className="add-appointment-overlay">
                    <button
                        onClick={() => window.location.href = '/add-appointment'}
                    >
                        <FaPlus /> {/* אייקון הפלוס */}
                        הוספת פגישה
                    </button>
                </div>
            )}
        </>
    );
};

export default Schedule;
