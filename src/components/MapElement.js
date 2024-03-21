// src/components/MapElement.js
import React from 'react';
import { Rect, Group, Text } from 'react-konva';

const MapElement = ({ x, y, width, height, label }) => {
  return (
    <Group x={x} y={y}>
      <Rect
        width={width}
        height={height}
        fill="blue"
        draggable
      />
      <Text text={label} fontSize={12} fill="white" />
    </Group>
  );
};

export default MapElement;
