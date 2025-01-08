import React, { useEffect, useState } from 'react'
import axios from "axios"
import "./Favourites.css"
import Footer from '../Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../../store/userSlice';

function Favourites() {

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

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

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080");
      const postsData = await Promise.all(response.data.map(async post => {
        const userResponse = await axios.get('http://localhost:8080/username', {
          params: { id: post.user_id }
        });

        const commentsResponse = await axios.get(`http://localhost:8080/comments/${post.id}`);
        const commentsData = commentsResponse.data;

        return { 
          ...post, 
          username: userResponse.data, 
          comments: commentsData 
        };
      }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/delete/${id}`);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLike = async (id) => {
    await axios.post(`http://localhost:8080/like/${id}`);
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]) return;
    try {
      const response = await axios.post('http://localhost:8080/createcomment', {
        post_id: postId,
        user_id: userID,
        comment_text: newComment[postId],
      });

      setNewComment({ ...newComment, [postId]: '' });
      fetchAPI();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentChange = (postId, text) => {
    setNewComment({ ...newComment, [postId]: text });
  };

  return (
    <>
    <div className='favouritescontainer'>
      Favourites
      <div className='firstcont'>
      {
        posts
          .filter(post => post.likes >= 1)  
          .sort((a, b) => b.likes - a.likes)  
          .map((post, index) => (
            <div key={index} className='maphome'>
              <p>{post.title} - {post.description} - {post.likes} - user_id:{post.user_id} - user_name : {post.username}</p>
              <input
                type="text"
                value={newComment[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                placeholder="Write a comment"
              />
              <div>
                <button 
                  className='buttoncomment'
                  onClick={() => handleAddComment(post.id)} 
                >
                  Add comment
                </button>
                {post.user_id !== userID && (
                  <button onClick={() => handleLike(post.id)} className='buttonlike'>
                    Like
                  </button>
                )}
                {post.user_id === userID && (
                  <button onClick={() => handleDelete(post.id)} className='buttonlike'>
                    Delete
                  </button>
                )}
              </div>
              <div className="comments-section">
                <h4>Comments:</h4>
                {post.comments && post.comments.map((comment, idx) => (
                  <div key={idx} className="comment">
                    <p><strong>{comment.user_name}</strong>: {comment.comment_text}</p>
                  </div>
                ))}
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

export default Favourites;
