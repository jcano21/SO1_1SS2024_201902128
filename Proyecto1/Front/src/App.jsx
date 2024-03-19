import { useState } from 'react'
//import RealTimeChart from './components/graficaram'
import GraficaRam from './components/graficaRAM'
import Arbol from './components/arbolprocesos'
import CPUUsageChart from './components/graficacpu'
import Diagrama from './components/diagrama'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div><h1>Monitoreo en Tiempo Real</h1></div>
    <div className="container">
      
      <div className="chart-container">
        <h2>Memoria Ram</h2>
        <GraficaRam />
      </div>

      <div className="chart-container">
        <h2> CPU</h2>
        <CPUUsageChart />
      </div>
    </div>

    <div>
      <h2>Arbol de Procesos</h2>
      <Arbol />
    </div>

    <div><h2>Diagrama de Estados</h2>
    <Diagrama/></div>
    </>
  );
}

export default App
