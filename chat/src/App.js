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

// helping out to push

function App() {
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
