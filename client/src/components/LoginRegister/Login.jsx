import React, { useState} from 'react';
import './LogReg.css';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { login } from '../../store/userSlice';

function Login() {
  const navigate = useNavigate();
  const [user_name, setUsername] = useState('');
  const [user_password, setUserpassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', { user_name, user_password });
      const { user_id, user_name: serverUserName } = response.data; 
      dispatch(login({ user_name: serverUserName, user_id }));
      localStorage.setItem('user', JSON.stringify({ user_id, user_name: serverUserName }));
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please check your username and password.');
    }
    setUsername('');
    setUserpassword('');
  };
  
  return (
    <div className="logregcontainer">
      Login
      <form className="formlogreg" onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={user_name} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={user_password} onChange={(e) => setUserpassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <NavLink to="/register" className="nav">
        Don't have an account? Register now!
      </NavLink>
    </div>
  );
}

export default Login;
