import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../../store/userSlice';

function Navbar() {
  const username = useSelector((state) => state.user.user_name);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userID = useSelector((state) => state.user.user_id);
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(login(user)); 
      console.log('User data restored:', user);
    }
  }, [dispatch]); 

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
  };

  return (
    <div className="navcontainer">
      <div className="logo">MyStore</div>
      <div>
        <NavLink className="navlink" to="/">Home</NavLink>
        <NavLink className="navlink" to="/favourites">Favourites</NavLink>
        <NavLink className="navlink" to="/myposts">My</NavLink>
        <span>
          {isLoggedIn ? (
            <span className="navlink">
              id:{userID} user:{username}
              <button className="logoutbtn" onClick={handleLogout}>LogOut</button>
            </span>
          ) : (
            <NavLink className="navlink" to="/login">Login</NavLink>
          )}
        </span>
      </div>
    </div>
  );
}

export default Navbar;
