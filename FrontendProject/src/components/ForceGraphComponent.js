import React, { useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';

const initialData = {
  nodes: [
    { id: 'node1', name: 'Node 1' },
    { id: 'node2', name: 'Node 2' },
    { id: 'node3', name: 'Node 3' },
    { id: 'node4', name: 'Node 4' },
    { id: 'node5', name: 'Node 5' },
    { id: 'node6', name: 'Node 6' },
    { id: 'node7', name: 'Node 7' },
    { id: 'node8', name: 'Node 8' },
  ],
  links: [
    { source: 'node1', target: 'node2' },
    { source: 'node2', target: 'node3' },
    { source: 'node2', target: 'node4' },
    { source: 'node4', target: 'node1' },
    { source: 'node4', target: 'node5' },
    { source: 'node6', target: 'node3' },
    { source: 'node7', target: 'node4' },
    { source: 'node8', target: 'node2' },
    { source: 'node6', target: 'node2' },
    { source: 'node3', target: 'node3' },
    { source: 'node4', target: 'node4' },
    { source: 'node7', target: 'node1' },
  ]
};

export const ForceGraphComponent = () => {
  const [graphData, setGraphData] = useState(initialData);
  const [url, setUrl] = useState('');

  const sendRequest = async (event) => {
    event.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/mine_repo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'url': url,
      },
      body: JSON.stringify({
        url: url,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {

      // Convert nodes from an object to an array and map each one to { id: nodeId }
      const nodesArray = Object.entries(data.nodes)
      .filter(([key, value]) => !isNaN(key))  // Filter to only entries where the key is a number
      .map(([key, value]) => ({ id: key, ...value })); // Transform each entry into a node object
      
      console.log(nodesArray)
      const convertedData = {
        nodes: nodesArray,
        links: [], // Since you don't need edges, keep this array empty
      };
      
      setGraphData(convertedData);
      
    } else {
      console.error('Failed to fetch graph data:', data);
    }
  };

  return (
    <div>
      <form onSubmit={sendRequest} style={{ textAlign: 'center', margin: '50px' }}>
        <input 
          type="text" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
          placeholder="Enter URL"
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Get the Network</button>
      </form>
      <ForceGraph2D 
        graphData={graphData}
        nodeAutoColorBy="id"
        onNodeHover={node => document.body.style.cursor = node ? 'pointer' : null}
        onNodeClick={node => window.alert(`Clicked node ${node.id}`)}
      />
    </div>
  );
};


export default ForceGraphComponent;
