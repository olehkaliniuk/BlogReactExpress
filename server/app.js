const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');

// Middleware
const corsOption = { origin: "http://localhost:5173" };
app.use(bodyParser.json());
app.use(cors(corsOption));

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'NewVinted'
}).promise();

// Port
const PORT = process.env.PORT || 8080;





// Show posts 
app.get("/", async (req, res) => {
  const [posts] = await connection.query("SELECT * FROM posts");
  res.json(posts);
});

// Create post
app.post('/createpost', async (req, res) => {
  const { title, description, user_id} = req.body;
  await connection.query('INSERT INTO posts (title, description, user_id) VALUES (?, ?, ?)', [title, description, user_id]);
  res.send('Post created');
});

// Register
app.post('/register', async (req, res) => {
  const { user_name, user_password } = req.body;
  await connection.query('INSERT INTO users (user_name, user_password) VALUES (?, ?)', [user_name, user_password]);
  res.send('User created');
});

// Login
app.post('/login', async (req, res) => {
  const { user_name, user_password } = req.body;
    const [rows] = await connection.query(
      'SELECT id, user_name FROM users WHERE user_name = ? AND user_password = ?',
      [user_name, user_password]
    );
    if (rows.length > 0) {
      const user = rows[0];
      res.json({ user_id: user.id, user_name: user.user_name });
    } else {
      res.status(401).send("Invalid username or password");
    }
});

//myposts
app.get("/myposts", async (req, res) => {
  const user_id = req.query.user_id; 
  if (!user_id) {
    return res.status(400).send("User ID is required");
  }

  try {
    const [posts] = await connection.query("SELECT * FROM posts WHERE user_id = ?", [user_id]);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts");
  }
});


app.get("/username", async (req, res) => {
  const id = req.query.id; 
  const [rows] = await connection.query("SELECT user_name FROM users WHERE id = ?", [id]);
  if (rows.length > 0) {
    res.json(rows[0].user_name);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Delete post
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await connection.query('DELETE FROM posts WHERE id = ?', [id]);
  res.send('Post deleted');
});

// Like post
app.post('/like/:id', async (req, res) => {
  const { id } = req.params;
  await connection.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [id]);
  res.send('Like added');
});

// comments show
app.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const [comments] = await connection.query(`
      SELECT comments.id, comments.comment_text, users.user_name
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE post_id = ?
    `, [postId]);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});



//create comment
app.post('/createcomment', async (req, res) => {
  const { post_id, user_id, comment_text } = req.body;
  console.log('Received data:', { post_id, user_id, comment_text });
  if (!post_id || !user_id || !comment_text) {
    return res.status(400).json({ error: "Post ID, User ID, and comment text are required" });
  }
  try {
    const result = await connection.query(
      'INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)',
      [post_id, user_id, comment_text]
    );
    console.log('Query result:', result);
    res.status(201).send('Comment created');
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`App running on PORT: ${PORT}`);
});
