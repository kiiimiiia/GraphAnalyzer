import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Coauthorship from './Coauthorship';
import AuthorComponent from './AuthorComponent';
import Document from './Document';
import Navbar from './Navbar';
import Home from './Home';
import Chart from './chart'
import Coediting from './coeditingChart';

const AppRouter = () => {
  return (
    <Router>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/document" element={<Document />} />
        <Route path="/author" element={<AuthorComponent />} />
        <Route path="/coauthor" element={<Coauthorship />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/Coediting_Charts" element={<Coediting />} />

      </Routes>
    </Router>
  );
};

export default AppRouter