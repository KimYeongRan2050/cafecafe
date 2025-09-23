import React from "react";
import { Routes, Route } from 'react-router-dom';
import Idx from '../pages/index.jsx';

function MainRoutes({ onLogin, onSignupClick }) {

  return(
    <Routes>
      <Route path="/" element={<Idx onSignupClick={onSignupClick} />} />
    </Routes>
  )
};

export default MainRoutes;