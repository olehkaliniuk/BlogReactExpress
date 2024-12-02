import React, { useEffect, useState } from 'react'
import axios from "axios"
import './Home.css'
import Footer from '../Footer/Footer';

function Home() {
  const [posts, setPosts] = useState([]);



  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080");
    setPosts(response.data);
  };

  useEffect(() => {
    fetchAPI()
  }, [])

  // Add like to post
  const handleLike = async (id) => {
    await axios.post(`http://localhost:8080/${id}`);
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <>
    <div className='homecontainer'>
      Home
      <div className='firstcont'>
        {
          posts.map((post, index) => (

            <div key={index} className='maphome'>
              <p>{post.title} - {post.description} - {post.likes} - user_id:{post.user_id}</p>
              <div>
              <button className='buttoncomment'>Add comment</button>
              <button onClick={() => handleLike(post.id)} className='buttonlike'>Like</button>
              </div>
            </div>
          ))
        }
      </div>
      
    </div>
    <Footer/>
    </>
  )
}

export default Home;
