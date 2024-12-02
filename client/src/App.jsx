import "./App.css"
import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Favourites from './components/Favourites/Favourites';
import Footer from './components/Footer/Footer';
import CreatePost from './components/CreatePost/CreatePost';
import Login from './components/LoginRegister/Login';
import Register from './components/LoginRegister/Register';
import MyPosts from './components/MyPosts/MyPosts';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path='/favourites' element={<Favourites />}></Route>
        <Route path='/createpost' element={<CreatePost />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/myposts' element={<MyPosts />}></Route>
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default App
