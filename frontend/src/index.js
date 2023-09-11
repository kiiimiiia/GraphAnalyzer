import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import Network from "react-vis-network-graph";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// import "./network.css";
//import nodeData from "./data.json";
import writerImg from './images/writer2.png';
import documentImg from './images/file.png';
import mockData from './data-mock/no-date.json'; 


function App() {
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
    ]
  };

  const [data, setData] = useState(_data);

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
    if (response.ok) {
      const nodesArray = Object.entries(data.nodes)
        .map(([key, value]) => {
          const node = { id: key, ...value };
          node.icon = isNaN(key) ? 'document' : 'writer';
          return node;
        });
  
      const authors = nodesArray.filter(node => node.icon === 'writer');
      const documents = nodesArray.filter(node => node.icon === 'document');
  
      const offsetY = 100; // nodes vertically
  
      authors.forEach((author, index) => {
        author.y = index * offsetY;
      });
  
      documents.forEach((document, index) => {
        document.y = authors.length * offsetY + (index + 1) * offsetY;
      });
  
  
      const edgesArray = Object.entries(data.edges)
      .map(([key, value]) => {
        const [name, properties] = key.split(':').map((str) => str.trim());
        const { weight, connected_to, source, target } = value;
        return {
          from: name || '',
          to: connected_to || '',
          color: weight > 5 ? "red" : "purple", // adjust this logic based on your needs
        };
      })
      .filter((edge) => edge.from !== '');
      
      const extractedEdgesArray = edgesArray.map(({ from, to, color }) => ({ from, to, color }));
      
    
      const convertedData = {
        nodes: [...authors, ...documents],
        edges: extractedEdgesArray,
      };
      
      setDatas(convertedData);
    
        
    } else {
      console.error('Failed to fetch graph data:', data);
    }
  };

  const loadMockData = () => {
      const nodesArray = Object.entries(mockData.nodes)
      .map(([key, value]) => {
        const node = { id: key, ...value };
        node.icon = isNaN(key) ? 'document' : 'writer';
        return node;
      });

    const authors = nodesArray.filter(node => node.icon === 'writer');
    const documents = nodesArray.filter(node => node.icon === 'document');

    const offsetY = 100; // nodes vertically

    authors.forEach((author, index) => {
      author.y = index * offsetY;
    });

    documents.forEach((document, index) => {
      document.y = authors.length * offsetY + (index + 1) * offsetY;
    });


    const edgesArray = Object.entries(mockData.edges)
    .map(([key, value]) => {
      const [name, properties] = key.split(':').map((str) => str.trim());
      const { weight, connected_to, source, target } = value;
      return {
        from: name || '',
        to: connected_to || '',
        color: weight > 5 ? "red" : "purple", // adjust this logic based on your needs
      };
    })
    .filter((edge) => edge.from !== '');
    
    const extractedEdgesArray = edgesArray.map(({ from, to, color }) => ({ from, to, color }));
    

    const convertedData = {
      nodes: [...authors, ...documents],
      edges: extractedEdgesArray,
    };
    
    setDatas(convertedData);

  };
  
  // const sendRequest = async (event) => {
  //   event.preventDefault();
  //   const response = await fetch('http://127.0.0.1:5000/mine_repo', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'url': url,
  //     },
  //     body: JSON.stringify({
  //       url: url,
  //     }),
  //   });
  //   const data = await response.json();
  //   if (response.ok) {
  //     const nodesArray = Object.entries(data.nodes)
  //       .map(([key, value]) => {
  //         const node = { id: key, ...value };
  //         node.icon = isNaN(key) ? 'document' : 'writer';
  //         return node;
  //       });
    
  //     const authors = nodesArray.filter(node => node.icon === 'writer');
  //     const documents = nodesArray.filter(node => node.icon === 'document');
    
  //     const offsetY = 100; // nodes vertically
    
  //     authors.forEach((author, index) => {
  //       author.y = index * offsetY;
  //     });
    
  //     documents.forEach((document, index) => {
  //       document.y = authors.length * offsetY + (index + 1) * offsetY;
  //     });
    

  //     const edgesArray = Object.entries(data.edges)
  //     .map(([key, value]) => {
  //       const [name, properties] = key.split(':').map((str) => str.trim());
  //       const { weight, connected_to, source, target } = value;
  //       return {
  //         source: name || '',
  //         target: connected_to || '',
  //         weight: weight || 0,
  //         connected_to: connected_to || 0,
  //       };
  //     })
  //     .filter((edge) => edge.source !== '');
    
  //     const extractedEdgesArray = edgesArray.map(({ source, target }) => ({ source, target }));
  

  //     const convertedData = {
  //       nodes: [...authors, ...documents],
  //       links: extractedEdgesArray,
  //     };
    
  //     setDatas(convertedData);
        
  //   } else {
  //     console.error('Failed to fetch graph data:', data);
  //   }
      
  // };

  const options = {
    interaction: {
      selectable: true,
      hover: true
    },
    manipulation: {
      enabled: true,
      initiallyActive: true,
      addNode: false,
      addEdge: false,
      /*  Adding new node to the graph */
      // addNode: (data) => {
      //   // console.log(callback,"callback")
      //   console.log("Addnode is called for dragginggg.........");
      //   console.log(data, "before main console");
      //   data.id = newId;
      //   data.image = newImage;
      //   data.label = newLabel;
      //   data.size = imgsize;
      //   data.title = newTitle;
      //   data.shape = "image";
      //   // if (typeof callback === "function") {
      //   // callback(data); // }
      //   // callback(data);
      //   setId("");
      //   setLabel("");
      //   setTitle("");
      //   setImage("");
      //   setImgsize("");
      //   console.log(data, "myData");
      //   console.log(graphRef, "mygraphical");
      // },
      // addEdge: true,
      // editNode: undefined,
      // editEdge: true,
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

  return (
    <> 
    <div>
        <form onSubmit={sendRequest} style={{ textAlign: 'center', margin: '50px' }}>
        <button type="button" onClick={loadMockData}>Load Mock Data</button>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Get the Network</button>
        </form>
      </div>
      <div>
        <Grid>
          <Grid item md={7} style={{ display: "flex" }}>
            <Network
              graph={data}
              ref={graphRef}
              options={options}
              events={{
                click: handleNodeClick
              }}
              getNetwork={(network) => {
                network.on("afterDrawing", (ctx) => {
                  data.nodes.forEach((node) => {
                    const iconImg = new Image();
                    iconImg.src =
                      "https://www.iconarchive.com/download/i22783/kyo-tux/phuzion/Sign-Info.ico";
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
                      const iconWidth = 20; // width of the icon image
                      const iconHeight = 16;
                      iconImg.src =
                        "https://www.iconarchive.com/download/i22783/kyo-tux/phuzion/Sign-Info.ico";
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
                      iconImg.addEventListener("mouseover", myFunction, "false");
                    }
                  });
                });
              }}
              style={{ display: "flex", height: "40rem" }}
            />
          </Grid>
          <Grid item md={3}>
            <div>
              <p
                style={{
                  fontSize: "2rem",
                  color: "blue",
                  display: "flex",
                  justifyContent: "center",
                  fontFamily: "Verdana"
                }}
              >
                <b>Graph Analyzer</b>
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  display: "flex",
                  justifyContent: "center",
                  fontFamily: "Verdana"
                }}
              >
                <b>{datas}</b>
              </p>
            </div>
          </Grid>
          <Grid
            item
            md={12}
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <Button
              variant="contained"
              onClick={(e) => {
                sessionStorage.setItem("set", "yes");
                graphRef.current.updateGraph();
              }}
            >
              Price Tagger
            </Button>
            <Button
              variant="contained"
              onClick={(e) => {
                sessionStorage.setItem("set", "no");
                graphRef.current.updateGraph();
              }}
            >
              Cura
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                console.log(data, "hujhgh");
                console.log(JSON.stringify(data), "########");
                const jsonString = JSON.stringify(data, null, 2); // Using null, 2 for pretty formatting

                // Create a Blob from the JSON string
                const blob = new Blob([jsonString], { type: "application/json" });

                // Create a URL for the Blob
                const url = URL.createObjectURL(blob);

                // Create a link element to download the JSON file
                const link = document.createElement("a");
                link.href = url;
                link.download = "data.json";
                document.body.appendChild(link);
                link.click();

                // Clean up by revoking the URL and removing the link element
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
              }}
            >
              Fetch updated data
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
