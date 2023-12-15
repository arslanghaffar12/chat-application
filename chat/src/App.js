import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authenticate from './components/Authenticaiton';
import Login from './pages/Login';
import Home from './pages/Home';
import Users from './pages/Users';
import Layout from './components/Layout';
import { SocketProvider } from './SocketContext';
import AddUser from './pages/user/AddUser';
import Profile from './pages/Profile';
import axios from 'axios';
import { storage } from './helpers/common';

// helping out to push

function App() {



  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Do something with the response data
      console.log('Response interceptor:', response);
      return response;
    },
    function (error) {
      // Handle the error gracefully
      try {
        // Check if the error is due to a 401 Unauthorized status
        if (error.response.status === 401) {
          // Custom handling for 401 error (e.g., show an alert)
          // alert('Authentication failed. Please log in.');
          // storage.clear();
          // window.location.reload();


          // Ensure the error is rejected to propagate it to the calling code
          return Promise.reject(error);
        }

        // For other errors, log and handle them as needed
        console.error('Response interceptor error:', error);

        // Ensure the error is rejected to propagate it to the calling code
        return Promise.reject(error);
      } catch (err) {
        // Log any unexpected errors during error handling
        console.error('Error in error handling logic:', err);
      }
    }
  );



  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Authenticate><Layout /></Authenticate>}  >
            <Route index element={<Profile />} />
            <Route path='/chat' element={<Home />} />
            <Route path='/users' element={<Users />} />
            <Route path='/add-member' element={<AddUser />} />


          </Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
