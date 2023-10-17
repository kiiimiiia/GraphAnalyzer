import React, { useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CommitPanel from './CommitPanel'; 

const initialData = [
  { name: '1', degree_centrality: 4000, amt: 2400 },
  { name: '2', degree_centrality: 3000, amt: 2210 },
  { name: '3', degree_centrality: 2000, amt: 2290 },
  { name: '4', degree_centrality: 2780, amt: 2000 },
  { name: '5', degree_centrality: 1890, amt: 2181 },
  { name: '6', degree_centrality: 2390,  amt: 2500 },
  { name: '7', degree_centrality: 3490, amt: 2100 },
];

const Coediting = () => {
    const [graphData, setGraphData] = useState(initialData);
    const [url, setUrl] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const sendRequest = async (event) => {
        event.preventDefault();
        const fromDateToBeSent = fromDate.replaceAll('-', ', ')
        const toDateToBeSent = toDate.replaceAll('-', ', ')
    
        const response = await fetch('http://127.0.0.1:5000/get_coediting_network', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'url': url,
            'fromdate': fromDateToBeSent,
            'todate': toDateToBeSent
          },
        });
        const data = await response.json();
        if (response.ok) {
          const authorsArray = Object.entries(data.measurements.author_degree_centrality)
            .map(([key, value]) => {
              const author = { id: key, ...value };
              author.name = key
              author.degree_centrality = value
              return author;
            });
            const pageRank = Object.entries(data.measurements.page_rank)
            .map(([key, value]) => {
              const page = { id: key, ...value };
              page.name = key
              page.degree_centrality = value
              return page;
            });
            const convertedData = {
                authors: authorsArray,
                pages: pageRank,
            };
          setGraphData(convertedData);

        } else {
            console.error('Failed to fetch graph data:', data);
          }}
  return (
    <>
    <form onSubmit={sendRequest} style={{ textAlign: 'center', margin: '50px' }}>

    <div className="url-input-container">
      <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="custom-url-input"
      />
      </div>
      <div className="date-input-container">
        <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="Enter from Date"
            className="custom-date-input"
        />
      </div>
      <div className="date-input-container">
        <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="Enter to Date"
            className="custom-date-input"
        />
      </div>
      <button type="submit">Get the Chart</button>
      </form>
    <div>
    <div style={{ textAlign: 'center', margin: 'auto', width: '50%' }}>
    <h2>Author Degree Centrality</h2>
    </div>
    <LineChart width={1200} height={300} data={graphData.authors}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="degree_centrality" stroke="#8884d8" />
    </LineChart>
    </div>
    <div>
    <div style={{ textAlign: 'center', margin: 'auto', width: '50%' }}>
    <h2>Author Rank</h2>
    </div>    <LineChart width={1200} height={300} data={graphData.pages}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="degree_centrality" stroke="#8884d8" />
    </LineChart>
    </div>
  </>

  );
};

export default Coediting;
