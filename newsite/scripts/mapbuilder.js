const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const exportButton = document.getElementById('exportButton');

let platforms = [];
let isDrawing = false;
let radius = 0.5;
const aspectRatio = 194.87 / 66;

function drawRoundedRectangle(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawPlatforms() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const platform of platforms) {
    drawRoundedRectangle(
      platform.transform.x * aspectRatio,
      platform.transform.y * aspectRatio,
      platform.size.width * aspectRatio,
      platform.size.height * aspectRatio,
      platform.radius * aspectRatio
    );
  }
}

function addPlatform(x, y, width, height) {
  platforms.push({
    transform: { x, y },
    size: { width, height },
    radius,
    biome: "Plain",
    visibility: true,
    AntiLockPlatform: false,
    blank: false
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
  currentX = x;
  currentY = y;
  drawPlatforms();
  drawRoundedRectangle(
    startX * aspectRatio,
    startY * aspectRatio,
    (currentX - startX) * aspectRatio,
    (currentY - startY) * aspectRatio,
    radius * aspectRatio
  );
});

canvas.addEventListener('mouseup', function(event) {
  if (!isDrawing) return;
  isDrawing = false;
  const { x, y } = getMousePosition(event);
  const width = (x - startX) * aspectRatio;
  const height = (y - startY) * aspectRatio;
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
    if (radius > 2) radius = 2;
  }
});

function exportPlatforms() {
  const mapName = document.getElementById('mapNameInput').value;

  const mapData = {
    version: document.getElementById('versionInput').value,
    mapName: mapName,
    description: document.getElementById('descriptionInput').value,
    developer:  document.getElementById('developerInput').value,
    dateCreated: new Date().toISOString().slice(0, 10),
    mapId: document.getElementById('mapIdInput').value,
    siteVersion: "0.3",
    icon: "https://raw.githubusercontent.com/abstractmelon/boplmapmaker/main/images/icon.jpeg",
    platforms: platforms
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

  document.getElementById('mapNameInput').value = '';
  document.getElementById('versionInput').value = '';
  document.getElementById('descriptionInput').value = '';
  document.getElementById('developerInput').value = '';
  document.getElementById('mapIdInput').value = '';
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
