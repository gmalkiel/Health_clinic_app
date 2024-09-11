import '../css/Login.css';      
import '@fortawesome/fontawesome-free/css/all.min.css';
import CalendarComponent from '../components/schedule'
import '../css/Home.css'
import { useParams } from 'react-router-dom';
const Home = () => {
  const { IsManager } = useParams(); // Get PatientID from the URL
  const { T_User_Name } = useParams(); // Get PatientID from the URL
  return (
   <>
     <div>
            <h1>לו"ז פגישות</h1>
            <CalendarComponent userType={IsManager} username={T_User_Name} />
        </div>
   </>
  );
};

export default Home;
