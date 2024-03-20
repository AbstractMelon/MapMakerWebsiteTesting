import React, { useState } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import ballImage from '../images/ball.png';
import longImage from '../images/long.png';

const MapCanvas = () => {
  const [objects, setObjects] = useState([]);
  const [selectedId, selectShape] = useState(null);

  const handleStageMouseDown = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleStageMouseDown}
    >
      <Layer>
        {objects.map((obj, i) => (
          <React.Fragment key={i}>
            {obj.objectType === 'Ball' && (
              <Image
                key={i}
                image={ballImage}
                x={obj.transform.x}
                y={obj.transform.y}
                width={obj.size.width}
                height={obj.size.height}
                draggable
                onClick={() => {
                  selectShape(i);
                }}
              />
            )}
            {obj.objectType === 'Long' && (
              <Image
                key={i}
                image={longImage}
                x={obj.transform.x}
                y={obj.transform.y}
                width={obj.size.width}
                height={obj.size.height}
                draggable
                onClick={() => {
                  selectShape(i);
                }}
              />
            )}
          </React.Fragment>
        ))}
        <Transformer
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          selectedShapeName="image"
        />
      </Layer>
    </Stage>
  );
};

export default MapCanvas;
