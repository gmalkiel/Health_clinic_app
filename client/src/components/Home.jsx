import '../css/Login.css';      
import '@fortawesome/fontawesome-free/css/all.min.css';
import CalendarComponent from '../components/schedule'
import '../css/Home.css'

const Home = () => {
  return (
   <>
     <div>
            <h1>לו"ז פגישות</h1>
           
            <CalendarComponent userType="therapist" username="moshe" />
        </div>
   </>
  );
};

export default Home;
