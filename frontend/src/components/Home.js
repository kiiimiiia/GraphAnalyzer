import React, { useState } from 'react';
import NetworkVisualization from "./NetworkVisualization";
import ForceGraphComponentWithDate from "./ForceGraphComponentWithDate";

const Home =()=>{
  const [currentPage, setCurrentPage] = useState(true);

    return (
        <div className="App">
          <button onClick={() => { setCurrentPage(!currentPage) }} className='button-toggle'>
              Mine Repo with {currentPage ? 'Date' : 'No Date'}
          </button>
          {currentPage ? <NetworkVisualization /> : <ForceGraphComponentWithDate />}
      </div>
  );
}
export default Home