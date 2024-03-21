// src/components/MapGrid.js
import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const MapGrid = () => {
  const [gridCells, setGridCells] = useState([]);
  const handleCellClick = (index) => {
  };

  return (
    <Stage width={800} height={600}>
      <Layer>
        {/* Render grid cells */}
        {gridCells.map((cell, index) => (
          <Rect
            key={index}
            x={cell.x}
            y={cell.y}
            width={50}
            height={50}
            fill="white"
            stroke="black"
            strokeWidth={1}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default MapGrid;
