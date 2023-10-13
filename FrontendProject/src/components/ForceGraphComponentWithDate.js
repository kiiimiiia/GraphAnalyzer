import React, { useState } from 'react';
import { ForceGraph2D,  } from 'react-force-graph';
import writerIcon from '../images/author.png'; // Import the writer icon
import documentIcon from '../images/code.png'; // Import the document icon



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

export const ForceGraphComponentWithDate = () => {
  const [graphData, setGraphData] = useState(initialData);
  const [url, setUrl] = useState('');
  const [date, setDate] = useState('');

  const sendRequest = async (event) => {
    event.preventDefault();
    const dateToBeSent = date.replaceAll('-', ', ')
    const response = await fetch('http://127.0.0.1:5000/mine_repo_with_date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'url': url,
        'from-date': dateToBeSent
      },
      body: JSON.stringify({
        url: url,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      const nodesArray = Object.entries(data.nodes)
        .map(([key, value]) => {
          const node = { id: key, ...value };
          node.icon = isNaN(key) ? 'document' : 'writer';
          return node;
        });
    
      const edgesArray = Object.entries(data.edges)
        .map(([key, value]) => {
          return {source: key.toString(), target: value.connected_to.toString()}
          // const [source, target] = key.split(':').map((id) => id.trim());
          // return { source: source || '', target: target || '', ...value };
        })
        .filter((edge) => edge.source !== '' && edge.target !== '');

      const convertedData = {
        nodes: nodesArray,
        links: edgesArray,
      };
    
      setGraphData(convertedData);
    } else {
      console.error('Failed to fetch graph data:', data);
    }
      
  };
  
  const margin = 10; // Adjust this value to control the margin
const nodeCanvasObject = (node, ctx, globalScale) => {
  const ICON_SIZE = 36;
    const textWidth = ctx.measureText(node.name).width;
    const radius = Math.max(ICON_SIZE, textWidth) / 2 + 4;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    if (node.icon === 'writer') {
      const image = new Image();
      image.src = writerIcon;
      ctx.drawImage(image, node.x - ICON_SIZE / 2, node.y - ICON_SIZE / 2, ICON_SIZE, ICON_SIZE);
    } else if (node.icon === 'document') {
      const image = new Image();
      image.src = documentIcon;
      ctx.drawImage(image, node.x - ICON_SIZE / 2, node.y - ICON_SIZE / 2, ICON_SIZE, ICON_SIZE);

    }

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '12px Sans-Serif';
    ctx.fillText(node.id , node.x, node.y + radius + 12);

    // Draw links
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 8;
    graphData.links.forEach((link) => {
      if (link.source === node.id || link.target === node.id) {
        const sourceNode = graphData.nodes.find((n) => n.id === link.source);
        const targetNode = graphData.nodes.find((n) => n.id === link.target);
        if (sourceNode && targetNode) {
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
        }
      }
    });
    ctx.stroke();
};


  return (
    <div>
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Enter Date"
            className="custom-date-input"
        />
      </div>

        <button type="submit">Get the Network</button>
      </form>
      <ForceGraph2D
      onEngineTick={() => {
        const nodes = graphData.nodes;
        // Create a map to store node positions
        const nodePositions = new Map();
      
        // Update positions based on node radii
        nodes.forEach((node) => {
          if(!node) return
          const ICON_SIZE = 36;
          const radius = ICON_SIZE / 2 + 4;
          const minDistance = (3 * radius) + 10; // Minimum distance to prevent overlap
          if (!nodePositions.has(node.id)) {
            nodePositions.set(node.id, { x: node.x, y: node.y });
          }
      
          // Check for overlap with other nodes
          for (const otherNode of nodes) {
            if (node !== otherNode) {
              const dx = node.x - otherNode.x;
              const dy = node.y - otherNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
      
              if (distance < minDistance) {
                // Calculate the direction to move the node away from the overlapping node
                const angle = Math.atan2(dy, dx);
                const moveX = (minDistance - distance) * Math.cos(angle);
                const moveY = (minDistance - distance) * Math.sin(angle);
      
                // Update the node's position
                node.x += moveX / 2;
                node.y += moveY / 2;
      
                // Update the other node's position as well
                const otherNodePosition = nodePositions.get(otherNode.id)
                if(otherNodePosition){
                  otherNodePosition.x -= moveX / 2;
                  otherNodePosition.y -= moveY / 2;}
              }
            }
          }
        });
      }}
        graphData={graphData}
        nodeAutoColorBy="id"
        onNodeHover={(node) => (document.body.style.cursor = node ? 'pointer' : null)}
        onNodeClick={(node) => window.alert(`Clicked node ${node.id}`)}
        nodeCanvasObject={nodeCanvasObject}
        
      />
    </div>
  );
};

export default ForceGraphComponentWithDate;
