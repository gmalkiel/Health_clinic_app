
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/components/Home';
import Login from '../src/components/login';
import Header from '../src/components/header';
import Therapists from '/src/components/Therapists';
import Patients from '../src/components/Patients';
import AddTherapist from '../src/components/AddTherapist';
//import DeleteTherapist from '../src/components/DeleteTherapist'; // Component to delete therapist
import TherapistDetails from '../src/components/TherapistDetails';
import AddPatient from '../src/components/AddPatient';


function App() {
  return (
    <Router>
       <Header /> {/* Header will be displayed on all pages */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/therapists" element={<Therapists />} />
        <Route path="/therapist/:id" element={<TherapistDetails />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/addTherapist" element={<AddTherapist />} />
        <Route path="/addPatient" element={<AddPatient />} />
        {/*טיפול במצב מחיקה של מטפל מה לעשות עם מטופלים שקשורים אליו האם למחוק אותם או לשייך אותם למטפל אחר? 
        <Route path="/delete-therapist/:id" element={<DeleteTherapist />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
