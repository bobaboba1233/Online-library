import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import BookDetails from './pages/BookDetails';
import Auth from './components/Auth/AuthModal';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/adminPanel' element={<AdminPanel/>}/>
        <Route path="/bookDetails/:id" element={<BookDetails />} />
      </Routes>
  );
}

export default App;
