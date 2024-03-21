import React, { useState } from 'react';
import MapGrid from './components/MapGrid';
import './style.css';


function App() {
  const [mapConfig, setMapConfig] = useState({
    mapName: 'Boplmap',
    description: 'A Bopl Map',
    developer: 'Abstractmelon',
    dateCreated: '2024-03-17',
    mapId: '1',
    siteVersion: '0.1',
    icon: 'https://raw.githubusercontent/abstractmelon/boplmapmaker/main/images/icon.jpeg',
    platforms: [
      {
        transform: { x: 10, y: 20 },
        rotation: 0,
        size: { width: 10, height: 10 },
        biome: 'Plain',
        platformType: 'Ball',
        visibility: true,
        AntiLockPlatform: false,
        blank: false,
      },
      {
        transform: { x: 30, y: 40 },
        rotation: 90,
        size: { width: 20, height: 5 },
        biome: 'Snow',
        platformType: 'Long',
        visibility: true,
        AntiLockPlatform: false,
        blank: true,
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMapConfig(prevConfig => ({
      ...prevConfig,
      [name]: value
    }));
  };

  const handleExport = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setMapConfig(prevConfig => ({
      ...prevConfig,
      dateCreated: currentDate
    }));

    const json = JSON.stringify(mapConfig);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map.boplmap';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
    <h1>Map Maker</h1>
    <div className="config">
        <label>Map Name:</label>
        <input type="text" name="mapName" value={mapConfig.mapName} onChange={handleInputChange} />
        <label>Description:</label>
        <input type="text" name="description" value={mapConfig.description} onChange={handleInputChange} />
        <label>Developer:</label>
        <input type="text" name="developer" value={mapConfig.developer} onChange={handleInputChange} />
        <label>Date Created:</label>
        <input type="text" name="dateCreated" value={mapConfig.dateCreated} onChange={handleInputChange} />
        <label>Map ID:</label>
        <input type="text" name="mapId" value={mapConfig.mapId} onChange={handleInputChange} />
        <label>Site Version:</label>
        <input type="text" name="siteVersion" value={mapConfig.siteVersion} onChange={handleInputChange} />
        <label>Icon:</label>
        <input type="text" name="icon" value={mapConfig.icon} onChange={handleInputChange} />
    </div>
    <button onClick={handleExport}>Export Map</button>
    <MapGrid />
    </div>
  );
}

export default App;
