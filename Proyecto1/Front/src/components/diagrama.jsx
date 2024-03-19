import React, { useState } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';

const Diagrama = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [pid, setPid] = useState('');
  const [network, setNetwork] = useState(null);

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
    if (network) {
      network.setData({ nodes: [], edges: [] });
    }
    if (buttonType === 'new') {
      createNewGraph();
    } else if (buttonType === 'resume') {
      createNewGraph();
    } else if (buttonType === 'stop') {
      createStopGraph();
     
    }else if (buttonType === 'kill'){
      createKillGraph();


    }
  };

  const handlePidChange = (event) => {
    setPid(event.target.value);
  };

  const createNewGraph = () => {
    const nodes = [
      { id: 1, label: 'New', color: 'rgba(54, 162, 235, 1)' },
      { id: 2, label: 'Ready', color: 'rgba(54, 162, 235, 1)' },
      { id: 3, label: 'Running', color: 'rgba(75, 192, 192, 1)' },
    ];

    const edges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ];

    const container = document.getElementById('network-container');

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      autoResize: true,
      height: '800px',
      width: '1200px',
      layout: {
        hierarchical: {
          direction: 'LR', // Left to right layout
        },
      },
    };

    const newNetwork = new Network(container, data, options);
    setNetwork(newNetwork);
  };

  const createStopGraph = () => {
    const nodes = [
      { id: 1, label: 'New', color: 'rgba(54, 162, 235, 1)' },
      { id: 2, label: 'Ready', color: 'rgba(75, 192, 192, 1)' },
      { id: 3, label: 'Running', color: 'rgba(54, 162, 235, 1)' },
    ];

    const edges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 2},
    ];

    const container = document.getElementById('network-container');

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      autoResize: true,
      height: '800px',
      width: '1200px',
      layout: {
        hierarchical: {
          direction: 'LR', // Left to right layout
        },
      },
    };

    const newNetwork = new Network(container, data, options);
    setNetwork(newNetwork);
  };

  const createKillGraph = () => {
    const nodes = [
      { id: 1, label: 'New', color: 'rgba(54, 162, 235, 1)' },
      { id: 2, label: 'Ready', color: 'rgba(54, 162, 235, 1)' },
      { id: 3, label: 'Running', color: 'rgba(54, 162, 235, 1)' },
      { id: 4, label: 'Terminated', color: 'rgba(75, 192, 192, 1)' },
    ];

    const edges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
    ];

    const container = document.getElementById('network-container');

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      autoResize: true,
      height: '800px',
      width: '1200px',
      layout: {
        hierarchical: {
          direction: 'LR', // Left to right layout
        },
      },
    };

    const newNetwork = new Network(container, data, options);
    setNetwork(newNetwork);
  };

 



  return (
    <div>
      <div>
        <button onClick={() => handleButtonClick('new')}>New</button>
        <button onClick={() => handleButtonClick('stop')}>Stop</button>
        <button onClick={() => handleButtonClick('resume')}>Ready</button>
        <button onClick={() => handleButtonClick('kill')}>Kill</button>
      </div>
      <div>
        <input type="text" value={pid} onChange={handlePidChange} placeholder="Enter PID" />
      </div>
      <div id="network-container"></div>
    </div>
  );
};

export default Diagrama;
