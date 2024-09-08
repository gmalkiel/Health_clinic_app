import '../css/Login.css';      
import '@fortawesome/fontawesome-free/css/all.min.css';
import CalendarComponent from '../components/schedule'

const Home = () => {
  return (
   <>
     <div>
            <h1>לוח שנה לניהול פגישות</h1>
            <CalendarComponent userType="admin" username="" />
        </div>
   </>
  );
};

export default Home;
