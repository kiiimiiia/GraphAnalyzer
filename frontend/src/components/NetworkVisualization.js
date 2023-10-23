import React, { useRef, useState } from "react";
import Network from "react-vis-network-graph";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Joyride, { STATUS } from 'react-joyride';
import { FaQuestionCircle } from 'react-icons/fa';
import writerImg from '../images/writer2.png';
import documentImg from '../images/file.png';
import mockData from '../data-mock/no-date.json'; 

const NetworkVisualization = () => {
  const graphRef = useRef(null);
  const [datas, setDatas] = useState("--");

  const [url, setUrl] = useState('');
  const _data = {
    nodes: [
      {
        id: "AWS",
        name: "AWS",
        label: "1",
        title: "AWS",
        shape: "image",
        image:documentImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "IBM",
        color: "blue",
        shape: "image",
        label: "2",
        title: "IBM",
        image: documentImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "SQL",
        color: "blue",
        shape: "image",
        title: "SQL",
        label: "3",
        image: documentImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "S3",
        color: "blue",
        shape: "image",
        // label:"Node 2",
        title: "S3",
        label: "4",
        image: documentImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "Azure",
        color: "blue",
        shape: "image",
        // label:"Node 3",
        label: "5",
        title: "Azure",
        image: writerImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "MongoDB",
        color: "blue",
        shape: "image",
        label: "6",
        title: "MongoDB",
        image: writerImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "ELB",
        color: "purple",
        shape: "image",

        label: "7",
        title: "ELB",
        image: writerImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "Saas",
        color: "purple",
        shape: "image",

        label: "8",
        title: "Saas",
        image: writerImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "Notion",
        color: "purple",
        shape: "image",

        label: "9",
        title: "Notion",
        image: writerImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "Appengine",
        label: "10",
        color: "purple",
        title: "Appengine",
        shape: "image",
        image: writerImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "Sematext",
        label: "11",
        color: "purple",
        title: "Sematext",
        shape: "image",
        image: writerImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "Jenkins",
        label: "12",
        color: "purple",
        title: "Jenkins",
        shape: "image",
        image: writerImg,
        size: 20,
        cost: "$1000"
      },
      {
        id: "Githup",
        label: "13",
        color: "purple",
        title: "Githup",
        shape: "image",
        image: writerImg,
        size: 20,
        cost: "$1000"
      }
    ],
    edges: [
      { from: "AWS", to: "IBM", color: "red" },
      { from: "AWS", to: "SQL", color: "red" },
      { from: "IBM", to: "S3", color: "red" },
      { from: "IBM", to: "Azure", color: "red" },
      { from: "IBM", to: "MongoDB", color: "red" },
      { from: "MongoDB", to: "AWS", color: "red" },
      { from: "Azure", to: "MongoDB", color: "red" },
      { from: "MongoDB", to: "ELB", color: "red" },
      { from: "AWS", to: "ELB", color: "purple" },
      { from: "ELB", to: "Saas", color: "purple" },
      { from: "Saas", to: "Notion", color: "purple" },
      { from: "Notion", to: "Appengine", color: "purple" },
      { from: "Githup", to: "Jenkins", color: "purple" },
      { from: "Sematext", to: "Appengine", color: "purple" },
      { from: "Githup", to: "Sematext", color: "purple" },
      { from: "Sematext", to: "AWS", color: "purple" },
      { from: "Jenkins", to: "ELB", color: "purple" }
    ],
  };

  const [data, setData] = useState(_data);
  const dataRef = useRef(_data);

  const processData = (data) => {
    const measurements = data.measurements;
    // console.log(measurements);
    // Convert nodes
    const nodesArray = Object.entries(data.nodes).map(([key, value]) => {
      const node = {
        id: key,
        title: key,
        label: key,
        shape: "image",
        cost: "$1000",
        pageRank: 0,
        degreeCentrality: 0,
    };
    
    if (isNaN(key)) {
        // It's a file
        node.color = "purple";
        node.image = documentImg;
        
        // Integrate file_degree_centrality and page_rank
        if (measurements.file_degree_centrality[key] !== undefined) {
            node.degreeCentrality =parseFloat(measurements.file_degree_centrality[key].toFixed(4));
        }
        if (measurements.page_rank[key] !== undefined) {
            node.pageRank = parseFloat(measurements.page_rank[key].toFixed(4));
            node.size = 10 + (measurements.page_rank[key] * 100); // Adjust size based on PageRank
        } else {
            node.size = 20; // Default size if PageRank is not available
        }
    } else {
        // It's an author
        node.color = "blue";
        node.image = writerImg;
        node.size = 20; // Default size for authors
    
        // Integrate author_degree_centrality
        if (measurements.author_degree_centrality[key] !== undefined) {
            node.degreeCentrality = parseFloat(measurements.author_degree_centrality[key].toFixed(4));
            node.size += measurements.author_degree_centrality[key] * 50; // Adjust size based on centrality
        }
    }
    
        
        return node;
    });

    // Convert edges
    const edgesArray = Object.entries(data.edges)
        .map(([key, value]) => {
            const edge = {
                from: key.split(':')[0].trim(),
                to: value.connected_to,
                color: value.weight > 5 ? "red" : "purple"
            };
            return edge;
        })
        .filter(edge => edge.from !== '');
      
    return {
        nodes: nodesArray,
        edges: edgesArray,
    };
    // const processedData = bipartiteLayout(nodesArray, edgesArray);
    // return processedData;
};

const sendRequest = async (event) => {
     event.preventDefault();
     const response = await fetch('http://127.0.0.1:5000/mine_repo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'url': url
      },

    });
    const data = await response.json();
    if (response.ok) {
        const convertedData = processData(data);
        setData(convertedData);
        dataRef.current = convertedData;
    } else {
        console.error('Failed to fetch graph data:', data);
    }    
};

  const loadMockData = () => {
      const convertedData = processData(mockData);
      console.log(convertedData);
      setData(convertedData);
      dataRef.current = convertedData;

      console.log(dataRef.current);

  };

  const options = {
    //     physics: {
    //     enabled: false
    // },
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

  
  function bipartiteLayout(nodes, edges) {
    let leftSet = new Set();  // Authors
    let rightSet = new Set(); // Files
    const separation = 400;   // Define separation between the two sets

    // Classify nodes based on your criteria 
    nodes.forEach(node => {
        if (node.image === writerImg) {
            leftSet.add(node.id);
        } else {
            rightSet.add(node.id);
        }
    });

    // Position nodes
    let leftY = 0;   // Y position for authors
    let rightY = 0;  // Y position for files

    nodes.forEach(node => {
        if (leftSet.has(node.id)) {
            node.x = 0;
            node.y = leftY;
            leftY += 100;  // Increment the y position for next node
        } else {
            node.x = separation;
            node.y = rightY;
            rightY += 100;  // Increment the y position for next node
        }
    });

    return {
        nodes: nodes,
        edges: edges
    };
}


  function myFunction() {
    // Code for your onclick function goes here
    console.log("Icon image clicked!");
  }
  const handleZoomIn = () => {
    if (graphRef.current) {
      // graphRef.current.zoomIn();
    }
  };
  const handleNodeClick = (event) => {
    console.log("click event is happened");
    console.log("click event is happened in handlenode click");
    console.log(event);
    setDatas(event.nodes[0]);
  };

  // Function to zoom out
  const handleZoomOut = () => {
    if (graphRef.current) {
      // graphRef.current.zoomOut();
    }
  };
 
  function displayTooltip(content, x, y) {
    console.log("hover");
    const tooltipDiv = document.getElementById('tooltipDiv');
    tooltipDiv.innerHTML = content;
    tooltipDiv.style.display = 'block';
    tooltipDiv.style.left = x + 'px';
    tooltipDiv.style.top = y + 'px';
 };

  function hideTooltip() {
      const tooltipDiv = document.getElementById('tooltipDiv');
      tooltipDiv.style.display = 'none';
  };


  const handleAfterDrawing = (network) => {
    console.log(data);
    network.on("afterDrawing", (ctx) => {
        data.nodes.forEach((node) => {
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
                iconImg.addEventListener("mouseover", myFunction, true);
            }
        });
    });
    network.on("hoverNode", function (params) {
          console.log("Hovered over node:", params.node);

      const nodeId = params.node;
      console.log(nodeId);
      console.log(data.nodes);
      const node = dataRef.current.nodes.find(n => n.id === nodeId);
      console.log(node);
      if (node) {
          const nodePosition = network.getPositions([nodeId])[nodeId];
          console.log(nodePosition);
          // Create your tooltip content using the node data
          const content = `
              <strong>ID:</strong> ${node.id} <br/>
              <strong>Title:</strong> ${node.title} <br/>
              <strong>Degree Centrality:</strong> ${node.degreeCentrality} <br/>
              <strong>Page Rank:</strong> ${node.pageRank} <br/>
          `;
          displayTooltip(content, nodePosition.x, nodePosition.y);
        }
    });

    network.on("blurNode", function (params) {
        hideTooltip();
    });
}

const [isTourActive, setIsTourActive] = useState(false);
    const steps = [
        {
            target: ".custom-url-input",
            content: "Enter the URL here to fetch the network."
        },
        {
            target: ".get-network-button",
            content: "Click here to get the network."
        },
        {
            target: ".mock-data-button",
            content: "Or use this button to load mock data."
        },
        //more steps as needed for other parts of the UI
    ];

  return (
  <> 
    <div>
      <form onSubmit={sendRequest} style={{ textAlign: 'center', margin: '50px' }}>
        <div className="url-input-container">
        <input
          className="custom-url-input"
          type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            style={{ marginRight: '10px' }}
        />
        <button className="get-network-button" type="submit">
            Get the Network
        </button>
        <button className="mock-data-button" type="button" onClick={loadMockData} style={{ marginLeft: '10px' }}>
            Load Mock Data 
        </button>
          <span 
                title="Take a tour to understand the functionalities."
                onClick={() => setIsTourActive(true)}
            >
            <FaQuestionCircle style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
            </span>

            <Joyride
                steps={steps}
                run={isTourActive}
                continuous={true}
                scrollToFirstStep={true}
                showProgress={true}
                showSkipButton={true}
                styles={{
                    options: {
                        zIndex: 10000
                    }
                }}
                callback={({ status }) => {
                    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                        setIsTourActive(false);
                    }
                }}
            />
        </div>
      </form>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item md={7} style={{ display: "flex", position: "relative", width: '100%' }}>
            <div id="tooltipDiv" style={{position: 'absolute', display: 'none', backgroundColor: 'white', border: '1px solid black', padding: '5px'}}></div>

            <Network
              graph={data}
              ref={graphRef}
              options={options}
              events={{
                  click: handleNodeClick
              }}
              getNetwork={handleAfterDrawing}
              style={{ display: "flex", height: "40rem", width: '100%' }}
            />
          </Grid>
      </Grid>

    </div>
  </>

  );
}

export default NetworkVisualization