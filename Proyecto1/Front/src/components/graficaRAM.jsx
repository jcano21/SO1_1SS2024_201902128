import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const GraficaRam = () => {
  const [memoriaEnUso, setMemoriaEnUso] = useState(0);
  const [memoriaLibre, setMemoriaLibre] = useState(0);
  const [porcentaje, setPorcentaje] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/ram');
        const jsonData = await response.json();

        const { memoriaEnUso, libre,porcentaje } = jsonData;

        setMemoriaEnUso(memoriaEnUso);
        setMemoriaLibre(libre);
        setPorcentaje(porcentaje);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    const intervalId = setInterval(fetchData, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const porcentajeEnUso = (memoriaEnUso / (memoriaEnUso + memoriaLibre)) * 100;

  return (
    <div style={{ width: '500px' }}>
      <CircularProgressbar value={porcentaje} text={`${porcentaje}%`} />
      <div>
        <p>Memoria en Uso: {memoriaEnUso} MB</p>
        <p>Memoria Libre: {memoriaLibre} MB</p>
      </div>
    </div>
  );
};

export default GraficaRam;