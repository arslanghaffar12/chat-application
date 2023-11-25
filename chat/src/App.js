import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authenticate from './components/Authenticaiton';
import Login from './pages/Login';
import Home from './pages/Home';
import Users from './pages/Users';
import Layout from './components/Layout';

// helping out to push

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Authenticate><Layout/></Authenticate>}  >
          <Route index element={<Home/>}/>
          <Route path='/users' element={<Users/>}/>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
