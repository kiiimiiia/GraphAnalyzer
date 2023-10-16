import React, { useRef, useState } from 'react';
import Network from "react-vis-network-graph";
import writerImg from '../images/author.png'; 
import documentImg from '../images/code.png'; 
import { Grid } from '@mui/material';

const options = {
  interaction: {
    selectable: true,
    hover: true
  },
  manipulation: {
    enabled: false,
    initiallyActive: true,
    addNode: false,
    addEdge: false,
    deleteNode: true,
    deleteEdge: true,
    shapeProperties: {
      borderDashes: false,
      useImageSize: false,
      useBorderWithImage: false
    },
    controlNodeStyle: {
      shape: "dot",
      size: 6,
      color: {
        background: "#ff0000",
        border: "#3c3c3c",
        highlight: {
          background: "#07f968",
          border: "#3c3c3c"
        },
        borderWidth: 2,
        borderWidthSelected: 2
      }
    },
    height: "100%",
    color: "green",
    hover: "true",
    nodes: {
      size: 20
    }
  }
};

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
  edges: [
    { from: 'node1', to: 'node2' },
    { from: 'node2', to: 'node3' },
    { from: 'node2', to: 'node4' },
    { from: 'node4', to: 'node1' },
    { from: 'node4', to: 'node5' },
    { from: 'node6', to: 'node3' },
    { from: 'node7', to: 'node4' },
    { from: 'node8', to: 'node2' },
    { from: 'node6', to: 'node2' },
    { from: 'node3', to: 'node3' },
    { from: 'node4', to: 'node4' },
    { from: 'node7', to: 'node1' },
  ]
};

export const AuthorComponent = () => {
  const graphRef = useRef(null);
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
      const nodesArray = Object.entries(data.nodes)
        .map(([key, value]) => {
          const node = { id: parseInt(key).toString(), ...value };
          node.shape = "image"
          node.label = parseInt(key)
          node.title = parseInt(key)
          node.image = writerImg
          return node;
        });
    
      const edgesArray = Object.entries(data.edges)
        .map(([key, value]) => {
          return {from: parseInt(key).toString(), to: value.connected_to.toString(), color: 'red'}
        })
        .filter((edge) => edge.from !== '' && edge.to !== '');
        console.log(edgesArray)

      const convertedData = {
        nodes: nodesArray,
        edges: edgesArray,
      };
      console.log(convertedData)
      setGraphData(convertedData);
    } else {
      console.error('Failed to fetch graph data:', data);
    }
      
  };

const processData = (data) => {
  // Convert nodes
  const nodesArray = Object.entries(data.nodes).map(([key, value]) => {
      const node = { id: key, title: key, label: key, shape: "image", size: 20, cost: "$1000" };
      if (isNaN(key)) {
          node.color = "red";
          node.image = documentImg;
      } else {
          node.color = "green";
          node.image = writerImg;
      }
      return node;
  });

  // Convert edges
  const edgesArray = Object.entries(data.edges)
      .flatMap(([key, value]) => {
          const { weight, connected_to } = value;
          return {
              from: key.split(':')[0].trim(),
              to: connected_to,
              color: weight > 5 ? "red" : "green"
          };
      })
      .filter(edge => edge.source !== '');
      
  return {
      nodes: nodesArray,
      edges: edgesArray,
  };
};


function myFunction() {
  console.log("Icon image clicked!");
}

const handleAfterDrawing = (network) => {
  network.on("afterDrawing", (ctx) => {
      graphData.nodes.forEach((node) => {
          const iconImg = new Image();
          iconImg.src = "https://www.iconarchive.com/download/i22783/kyo-tux/phuzion/Sign-Info.ico";
          const nodeId = node.id;
          const nodePosition = network.getPositions([nodeId])[nodeId];
          const nodeSize = 20;
          var setVal = sessionStorage.getItem("set");

          if (setVal === "yes") {
              console.log(setVal);
              ctx.font = "14px Arial";
              ctx.fillStyle = "#000000";
              ctx.textAlign = "center";
              ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
              ctx.shadowBlur = 5;
              ctx.fillStyle = "#ffcc00";
              ctx.fillRect(
                  nodePosition.x + nodeSize + 2,
                  nodePosition.y + nodeSize - 20,
                  50,
                  20
              );
              ctx.fillText(
                  node.label,
                  nodePosition.x,
                  nodePosition.y + nodeSize + 20
              );
              ctx.font = "12px Arial";
              ctx.color = "black";
              ctx.fillStyle = "black";
              ctx.textAlign = "left";
              ctx.fillText(
                  node.cost,
                  nodePosition.x + nodeSize + 5,
                  nodePosition.y + nodeSize - 5
              );
          } else if (setVal === "no") {
              console.log(setVal);
              const iconWidth = 20;
              const iconHeight = 16;
              iconImg.src = "https://www.iconarchive.com/download/i22783/kyo-tux/phuzion/Sign-Info.ico";
              ctx.font = "14px Arial";
              ctx.fillStyle = "#000000";
              ctx.textAlign = "center";
              ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
              ctx.shadowBlur = 5;
              ctx.fillStyle = "#ffcc00";
              ctx.drawImage(
                  iconImg,
                  nodePosition.x + nodeSize + 5,
                  nodePosition.y + nodeSize + 5,
                  iconWidth,
                  iconHeight
              );
              iconImg.addEventListener("mouseover", myFunction, false);
          }
      });
  });
}



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
      <button type="submit">Get the Network</button>
    </form>
    <div>
    <Grid item md={3}>
          <div>
            <p
              style={{
                fontSize: "2rem",
                color: "#4CAF50",
                display: "flex",
                justifyContent: "center",
                fontFamily: "Verdana"
              }}
            >
            </p>
          </div>
        </Grid>
      <Grid>
        <Grid item md={7} style={{ display: "flex" }}>
        <Network
          graph={graphData}
          ref={graphRef}
          options={options}
          getNetwork={handleAfterDrawing}
          style={{ display: "flex", height: "40rem" }}
      />
        </Grid>
      </Grid>

    </div>
  </>
  );
};

export default AuthorComponent;