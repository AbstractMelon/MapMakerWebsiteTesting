const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const exportButton = document.getElementById('exportButton');
const drawRectangleButton = document.getElementById('drawRectangleButton');
const drawCircleButton = document.getElementById('drawCircleButton');
const clearCanvasButton = document.getElementById('clearCanvasButton');

let platforms = [];
let isDrawing = false;
let radius = 0.5;
let isDrawingRectangle = true;
const aspectRatio = 194.87 / 66;

const mapx = 194.87
const mapy = 66

function drawRoundedRectangle(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.lineWidth = radius * 1; 
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

clearCanvasButton.addEventListener('click', function() {
  platforms = []; // Clear the platforms array
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
});

function drawPlatforms() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const platform of platforms) {
    if (platform.shape === 'rectangle') {
      drawRoundedRectangle(
        platform.transform.x * aspectRatio,
        platform.transform.y * aspectRatio,
        platform.size.width * aspectRatio,
        platform.size.height * aspectRatio,
        platform.radius * aspectRatio
      );
    } else if (platform.shape === 'circle') {
      drawCircle(
        (platform.transform.x + platform.size.width / 2) * aspectRatio,
        (platform.transform.y + platform.size.height / 2) * aspectRatio,
        (platform.size.width / 2) * aspectRatio
      );
    }
  }
}

function addPlatform(x, y, width, height) {
  platforms.push({
    transform: { x: x / aspectRatio, y: y / aspectRatio },
    size: { width: width / aspectRatio, height: height / aspectRatio },
    radius: radius / aspectRatio,
    biome: "Plain",
    visibility: true,
    AntiLockPlatform: false,
    blank: false,
    shape: isDrawingRectangle ? 'rectangle' : 'circle'
  });
}


function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / aspectRatio,
    y: (event.clientY - rect.top) / aspectRatio
  };
}

canvas.addEventListener('mousedown', function(event) {
  isDrawing = true;
  const { x, y } = getMousePosition(event);
  startX = x;
  startY = y;
});

canvas.addEventListener('mousemove', function(event) {
  if (!isDrawing) return;
  const { x, y } = getMousePosition(event);
  drawPlatforms();
  if (isDrawingRectangle) {
    drawRoundedRectangle(
      startX * aspectRatio,
      startY * aspectRatio, 
      (x - startX) * aspectRatio, 
      (y - startY) * aspectRatio, 
      radius * aspectRatio
    );
  } else {
    const centerX = (startX + x) / 2 * aspectRatio;
    const centerY = (startY + y) / 2 * aspectRatio;
    const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2)) / 2 * aspectRatio;
    drawCircle(centerX, centerY, radius);
  }
});

canvas.addEventListener('mouseup', function(event) {
  if (!isDrawing) return;
  isDrawing = false;
  const { x, y } = getMousePosition(event);
  const width = (x - startX) * aspectRatio;
  const height = (y - startY) * aspectRatio;
  
  const minWidth = 10; 
  const minHeight = 10; 
  
  if (Math.abs(width) < minWidth || Math.abs(height) < minHeight) {
    // alert('Platform size must be at least ' + minWidth + 'x' + minHeight);
    drawPlatforms(); 
    return;
  }
  
  addPlatform(startX * aspectRatio, startY * aspectRatio, width, height);
  drawPlatforms();
});


canvas.addEventListener('wheel', function(event) {
  event.preventDefault();
  if (event.deltaY > 0) {
    radius -= 0.1;
    if (radius < 0.1) radius = 0.05;
  } else {
    radius += 0.1;
    if (radius > 1) radius = 1;
  }
});

function exportPlatforms() {
  const mapName = document.getElementById('mapNameInput').value;

  const formattedPlatforms = platforms.map(platform => ({
    ...platform,
    transform: {
      x: platform.transform.x.toFixed(1),
      y: platform.transform.y.toFixed(1)
    },
    size: {
      width: platform.size.width.toFixed(1),
      height: platform.size.height.toFixed(1)
    },
    radius: platform.radius.toFixed(1)
  }));

  const mapData = {
    version: document.getElementById('versionInput').value,
    mapName: mapName,
    description: document.getElementById('descriptionInput').value,
    developer:  document.getElementById('developerInput').value,
    dateCreated: new Date().toISOString().slice(0, 10),
    mapId: document.getElementById('mapIdInput').value,
    siteVersion: "0.3",
    icon: "https://raw.githubusercontent.com/abstractmelon/boplmapmaker/main/images/icon.jpeg",
    platforms: formattedPlatforms
  };

  const jsonData = JSON.stringify(mapData, null, 2);

  const blob = new Blob([jsonData], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${mapName}.boplmap`;

  link.dispatchEvent(new MouseEvent('click'));

  window.URL.revokeObjectURL(link.href);
}

function openExportModal() {
  const modal = document.getElementById('exportModal');
  modal.style.display = 'block';

  document.getElementById('mapNameInput').value = 'boplmap';
  document.getElementById('versionInput').value = '1.0.0';
  document.getElementById('descriptionInput').value = 'Epic bopl map';
  document.getElementById('developerInput').value = 'Your name';
  document.getElementById('mapIdInput').value = '0';
}

function closeExportModal() {
  const modal = document.getElementById('exportModal');
  modal.style.display = 'none';
}

exportButton.addEventListener('click', openExportModal);

document.getElementById('cancelExport').addEventListener('click', closeExportModal);

document.getElementById('confirmExport').addEventListener('click', function() {
  exportPlatforms();
  closeExportModal();
});

drawRectangleButton.addEventListener('click', function() {
  isDrawingRectangle = true;
});

drawCircleButton.addEventListener('click', function() {
  isDrawingRectangle = false;
});
