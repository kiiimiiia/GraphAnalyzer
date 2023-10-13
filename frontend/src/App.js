import React, { useState } from 'react';
import ForceGraphComponent from './components/ForceGraphComponent';
import { ForceGraphComponentWithDate } from './components/ForceGraphComponentWithDate';
import RepoChart from './components/chart'; 
import './App.css'
import NetworkVisualization from './components/NetworkVisualization';


function App() {
  const [currentPage, setCurrentPage] = useState(true);
  const [showRepoChartPage, setShowRepoChartPage] = useState(false); // Initial value set to false to not show the RepoChart initially
  if (showRepoChartPage) {
      return (
          <div className="App">
              <button onClick={() => setShowRepoChartPage(false)} className='button-toggle'>Go Back</button>
              {/* Pass the necessary props (like title, url, dateToBeSent) to the RepoChart component as needed */}
              <RepoChart title="author_degree_centrality" />
              <RepoChart title="file_degree_centrality" />
              <RepoChart title="page_rank" />
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
          {currentPage ? <NetworkVisualization /> : <ForceGraphComponentWithDate />}
      </div>
  );
}

// function App() {
//   const [currentPage, setCurrentPage] = useState(true);
//   return (
//     <div className="App">
//       <button onClick={()=>{setCurrentPage(!currentPage)}} className='button-toggle'>Mine Repo with {currentPage ?'Date': 'No Date'}</button>
//       {currentPage ? <ForceGraphComponent /> : <ForceGraphComponentWithDate/>}
//     </div>
//   );
// }

export default App;

