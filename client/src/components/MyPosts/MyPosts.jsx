import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPosts.css';
import { useSelector } from 'react-redux';
import Footer from '../Footer/Footer';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const userID = useSelector((state) => state.user.user_id);

 
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/myposts', {
        params: { user_id: userID },
      });
      const postsData = await Promise.all(response.data.map(async (post) => {
        const commentsResponse = await axios.get(`http://localhost:8080/comments/${post.id}`);
        return { 
          ...post, 
          comments: commentsResponse.data 
        };
      }));
      setPosts(postsData);
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


  const handleAddComment = async (postId) => {
    if (!newComment[postId]) return;
    try {
      const response = await axios.post('http://localhost:8080/createcomment', {
        post_id: postId,
        user_id: userID,
        comment_text: newComment[postId],
      });

     
      setNewComment({ ...newComment, [postId]: '' });
      fetchUserPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };


  const handleCommentChange = (postId, text) => {
    setNewComment({ ...newComment, [postId]: text });
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
                
  
                <input
                  type="text"
                  value={newComment[post.id] || ""}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  placeholder="Write a comment"
                />
                <button 
                  className='buttoncomment'
                  onClick={() => handleAddComment(post.id)}
                >
                  Add comment
                </button>

          
                <button onClick={() => handleDelete(post.id)} className='buttonlike'>Delete</button>


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
