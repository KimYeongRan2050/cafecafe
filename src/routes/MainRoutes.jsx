import React from "react";
import { Routes, Route } from 'react-router-dom';
import Index from '../pages/index.jsx';

function MainRoutes({ onLogin, onSignupClick }) {

  return(
    <Routes>
      <Route path="/" element={<Index onSignupClick={onSignupClick} />} />
    </Routes>
  )
};

export default MainRoutes;