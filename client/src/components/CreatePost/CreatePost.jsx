import React, { useState } from 'react';
import './CreatePost.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CreatePost() {

  const userID = useSelector((state) => state.user.user_id);


  const [title, setPostTitle] = useState('');
  const [description, setPostDescription] = useState('');

  


  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await axios.post('http://localhost:8080/createpost', { 
        title, 
        description, 
        user_id: userID  
      });
      setPostTitle(''); 
      setPostDescription('');
      navigate('/'); 
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div className='createpostcontainer'>
      Create Post
      <form className='formcreate' onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder='Title' 
          value={title} 
          onChange={(e) => setPostTitle(e.target.value)} 
          required 
        />
        <input 
          placeholder='Description' 
          value={description} 
          onChange={(e) => setPostDescription(e.target.value)} 
          required 
        />
        <button type='submit'>Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
