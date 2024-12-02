import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Footer.css"
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';




function Footer() {

  const userID = useSelector((state) => state.user.user_id);


  const fetchUserPosts = async () => {
      const response = await axios.get('http://localhost:8080/myposts', {
        params: { user_id: userID },
      });
  };


  useEffect(() => {
    if (userID) {
      fetchUserPosts();
    }
  }, [userID]);




  return (
    <div>
    <div className='footercontainer'>
      
      {userID ? (
        <div>
          <button className='addbtn'>
            <NavLink className='navlinkfooter' to={'/createpost'}>
                Create new post
            </NavLink>
          </button>
        </div>
      ) : (
        <NavLink className='navlinkfooter' to={'/login'}>
        <div className='loginn'>You need to log in to create a post</div>
        </NavLink>
      )}
     
    </div>
    <div className='end'>Oleh Kaliniuk 2024</div>
    </div>
  )
}

export default Footer
