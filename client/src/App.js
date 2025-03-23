import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ProjectsList from './pages/ProjectsList';
// import Project from './pages/Project';
import Header from './components/Header';
import NotFound from './pages/NotFound';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <div className="flex flex-col">
      {/* <Navbar /> */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="flex flex-1">
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<ProjectsList />} />
            </>
          ) : (
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          )}
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/:userId/:projectId" element={<Project />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
