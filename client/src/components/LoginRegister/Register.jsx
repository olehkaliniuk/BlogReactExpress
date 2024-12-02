import React, { useState } from 'react';
import './LogReg.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Register() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/login');
  };


  const [user_name, setUsername] = useState('');
  const [user_password, setUserpassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
      const response = await axios.post('http://localhost:8080/register', { user_name, user_password });
      setUsername(''); 
      setUserpassword(''); 
  };


  return (
    <div className="logregcontainer">
      Register
      <form className="formlogreg" onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={user_name} onChange={(e) => setUsername(e.target.value)} required/>
        <input type="password" placeholder="Password" value={user_password} onChange={(e) => setUserpassword(e.target.value)} required/>
        <button type="submit"  onClick={handleRedirect}>Register</button>
      </form>
      <NavLink to="/login" className="nav">
        Already have an account? Login now!
      </NavLink>
    </div>
  );
}

export default Register;
