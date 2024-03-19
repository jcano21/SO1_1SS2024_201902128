import React, { useState, useEffect } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';

const Arbol = () => {
  const [processes, setProcesses] = useState([]);
  const [selectedPid, setSelectedPid] = useState(null);
  const [processDetails, setProcessDetails] = useState({ nodes: [], edges: [] });

  useEffect(() => {
  
    fetch('/api/arbol')
      .then(response => response.json())
      .then(data => {
        // Filtrar los procesos padres
        const parentProcesses = data.processes.filter(process => {
          return process.child !== undefined;
        });
        setProcesses(parentProcesses);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (selectedPid && processDetails.nodes.length > 0) {
   
      drawTree();
    }
  }, [selectedPid, processDetails]);

  const drawTree = () => {
  
    const container = document.getElementById('tree-container');
    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      layout: {
        hierarchical: {
          direction: 'UD',
          nodeSpacing: 300, 
        },
      },
    };
    const network = new Network(container, processDetails, options);
  };

  const handlePidChange = (event) => {
  const selectedPid = event.target.value;
  setSelectedPid(selectedPid);
  
  fetch(`/proceso/${selectedPid}`)
    .then(response => response.json())
    .then(data => {
      console.log('JSON de respuesta:', data);
      const nodes = [];
      const edges = [];
     
      nodes.push({ id: selectedPid, label: `PID: ${selectedPid}`, level: 0 });
      data.child.forEach(child => {
        nodes.push({ id: child.pid, label: `${child.pid}`, level: 1 });
        edges.push({ from: selectedPid, to: child.pid });
      });
      setProcessDetails({ nodes: nodes, edges: edges });
    })
    .catch(error => console.error('Error fetching process details:', error));
};

  return (
    <div>
      <select onChange={handlePidChange}>
        <option value="">Seleccione un PID</option>
        {processes.map(process => (
          <option key={process.pid} value={process.pid}>{process.pid}</option>
        ))}
      </select>
      <div id="tree-container" style={{ height: '800px', width: '100%' }}></div> 
    </div>
  );
};

export default Arbol;