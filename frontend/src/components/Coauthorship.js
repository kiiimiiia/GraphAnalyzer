import React, { useRef, useState } from 'react';
import Network from "react-vis-network-graph";
import writerImg from '../images/author.png'; 
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

export const Coauthorship = () => {
  const graphRef = useRef(null);
  const [graphData, setGraphData] = useState(initialData);
  const [url, setUrl] = useState('');
  const [file_paths, setFilePath] = useState('');
  const [toDate, setToDate] = useState('');

  const sendRequest = async (event) => {
    event.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/get_coauthorship_network', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'url': url,
        // 'file_paths': file_paths,
        // 'todate': toDate
      },
    });
    const data = await response.json();
    if (response.ok) {
      const nodesArray = Object.entries(data.dag_data.nodes)
        .map(([key, value]) => {
          const node = { id: key, ...value };
          node.shape = "image"
          node.label = key
          node.title = key
          node.image = writerImg
          return node;
        });
    
      const edgesArray = Object.entries(data.dag_data.edges)
        .map(([key, value]) => {
          return {from: key, to: value, color: 'red'}
        })
        .filter((edge) => edge.from !== '' && edge.to !== '');

      const convertedData = {
        nodes: nodesArray,
        edges: edgesArray,
      };
      console.log(edgesArray)

      setGraphData(convertedData);
    } else {
      console.error('Failed to fetch graph data:', data);
    }
      
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
      {/* <div className="file-input-container">
      <input
          type="text"
          value={file_paths}
          onChange={(e) => setFilePath(e.target.value)}
          placeholder="Enter File"
          className="custom-file-input"
      />
      </div> */}

      <button type="submit">Get the Network</button>
    </form>
    <div>
    {/* <CommitPanel firstCommitDate={graphData.first_commit_date} lastCommitDate={graphData.last_commit_date} /> */}
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

export default Coauthorship;
