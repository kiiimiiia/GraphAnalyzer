import React, { useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';

const initialData = {
  nodes: [
    { id: 'node1', name: 'Node 1' },
    { id: 'node2', name: 'Node 2' },
    { id: 'node3', name: 'Node 3' },
    { id: 'node4', name: 'Node 4' },
  ],
  links: [
    { source: 'node1', target: 'node2' },
    { source: 'node2', target: 'node3' },
    { source: 'node2', target: 'node4' },
    { source: 'node4', target: 'node1' },
  ]
};

export const ForceGraphComponent = () => {
  const [graphData] = useState(initialData);
  const [url, setUrl] = useState('');

  const sendRequest = async (event) => {
    event.preventDefault();
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
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
        <button type="submit">Send Request</button>
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
