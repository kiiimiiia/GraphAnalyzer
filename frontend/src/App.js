import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import './App.css'
import { ForceGraphComponentWithDate } from './components/ForceGraphComponentWithDate';
//import { AuthorComponent } from './components/AuthorComponent';
import {Document} from './components/Document';

import NetworkVisualization from './components/NetworkVisualization';
//import BarChart from './components/BarChart';

function App() {
  const [currentPage, setCurrentPage] = useState(true);
  const [showRepoChartPage, setShowRepoChartPage] = useState(false); // Initial value set to false to not show the RepoChart initially
  if (showRepoChartPage) {
      return (
          <div className="App">
              <button onClick={() => setShowRepoChartPage(false)} className='button-toggle'>Go Back</button>
                {/* <BarChart
                goBack={() => setShowRepoChartPage(true)}
            /> */}
          </div>
      );
  }
    
  return (
      <div className="App">
          <button onClick={() => { setCurrentPage(!currentPage) }} className='button-toggle'>
              Mine Repo with {currentPage ? 'Date' : 'No Date'}
          </button>
          <button onClick={() => setShowRepoChartPage(true)} className='button-toggle'>
              Open RepoChart Page
          </button>
          {currentPage ? <NetworkVisualization /> : <Document />}
      </div>
  );
}

export default App;

