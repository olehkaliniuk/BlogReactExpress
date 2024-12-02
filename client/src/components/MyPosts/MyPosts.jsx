import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPosts.css';
import { useSelector } from 'react-redux';
import Footer from '../Footer/Footer';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const userID = useSelector((state) => state.user.user_id);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/myposts', {
        params: { user_id: userID },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchUserPosts();
    }
  }, [userID]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/${id}`);
      fetchUserPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <>
    <div className="mypostscontainer">
      My Posts
      <div className='firstcont'>
        {userID ? (
          posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className='maphome'>
                <p>{post.title} - {post.description} - {post.likes}</p>
                <button onClick={() => handleDelete(post.id)} className='buttonlike'>Delete</button>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )
        ) : (
          <p>You need to log in</p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default MyPosts;
