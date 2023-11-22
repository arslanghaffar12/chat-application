import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authenticate from './components/Authenticaiton';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Authenticate><Layout/></Authenticate>}  >
          <Route index element={<Home/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
