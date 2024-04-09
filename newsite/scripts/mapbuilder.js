const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const exportButton = document.getElementById('exportButton');

let platforms = []; // List the platforms
let isDrawing = false; // No drawing on load
let startX, startY, currentX, currentY;
let radius = 0.5; // Default radius
const aspectRatio = 194.87 / 66; // Aspect ratio of the map

// Draw a rounded rectangle (cube)
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

// Draw all platforms on the canvas
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

// Add a new platform
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

// Event listener to handle mouse down and start drawing
canvas.addEventListener('mousedown', function(event) {
  isDrawing = true;
  startX = event.clientX - canvas.getBoundingClientRect().left;
  startY = event.clientY - canvas.getBoundingClientRect().top;
});

// Event listener to handle mouse move and continue drawing
canvas.addEventListener('mousemove', function(event) {
  if (!isDrawing) return;
  currentX = event.clientX - canvas.getBoundingClientRect().left;
  currentY = event.clientY - canvas.getBoundingClientRect().top;
  drawPlatforms();
  drawRoundedRectangle(
    startX, 
    startY, 
    (currentX - startX) / aspectRatio, 
    (currentY - startY) / aspectRatio, 
    radius * aspectRatio
  );
});

// Event listener to handle mouse up and stop drawing
canvas.addEventListener('mouseup', function(event) {
  if (!isDrawing) return;
  isDrawing = false;
  currentX = event.clientX - canvas.getBoundingClientRect().left;
  currentY = event.clientY - canvas.getBoundingClientRect().top;
  const width = (currentX - startX) / aspectRatio;
  const height = (currentY - startY) / aspectRatio;
  addPlatform(startX / aspectRatio, startY / aspectRatio, width, height);
  drawPlatforms();
});

// Event listener to handle scroll wheel and change the radius
canvas.addEventListener('wheel', function(event) {
  event.preventDefault(); // Prevent scrolling
  if (event.deltaY > 0) {
    // Scrolling down, decrease radius
    radius -= 0.1; // Decrease by 0.1
    if (radius < 0.1) radius = 0.05; // Minimum radius
  } else {
    // Scrolling up, increase radius
    radius += 0.1; // Increase by 0.1
    if (radius > 1) radius = 1; // Maximum radius
  }
});

// Function to export platforms to .boplmap file
function exportPlatforms() {
    const mapName = document.getElementById('mapName').value;
  
    const mapData = {
      version: document.getElementById('version').value,
      mapName: mapName,
      description: document.getElementById('description').value,
      developer: document.getElementById('developer').value,
      dateCreated: new Date().toISOString().slice(0, 10),
      mapId: document.getElementById('mapId').value,
      siteVersion: "0.3",
      icon: "https://raw.githubusercontent.com/abstractmelon/boplmapmaker/main/images/icon.jpeg",
      platforms: platforms
    };
  
    const jsonData = JSON.stringify(mapData, null, 2);
  
    // Create a Blob object containing the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });
  
    // Create a download link for the Blob
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${mapName}.boplmap`;
  
    // Programmatically trigger the click event on the link
    link.dispatchEvent(new MouseEvent('click'));
  
    // Clean up
    window.URL.revokeObjectURL(link.href);
  }
  
  function openExportModal() {
    // Show the export modal
    const modal = document.getElementById('exportModal');
    modal.style.display = 'block';
  
    // Populate input fields with current values
    document.getElementById('mapNameInput').value = document.getElementById('mapName').value;
    document.getElementById('versionInput').value = document.getElementById('version').value;
    document.getElementById('descriptionInput').value = document.getElementById('description').value;
    document.getElementById('developerInput').value = document.getElementById('developer').value;
    document.getElementById('mapIdInput').value = document.getElementById('mapId').value;
  }
  
  // Function to close the export modal
  function closeExportModal() {
    // Hide the export modal
    const modal = document.getElementById('exportModal');
    modal.style.display = 'none';
  }
  
  // Event listener for export button click
  exportButton.addEventListener('click', openExportModal);
  
  // Event listener for cancel button in export modal
  document.getElementById('cancelExport').addEventListener('click', closeExportModal);
  
  // Event listener for confirm button in export modal
  document.getElementById('confirmExport').addEventListener('click', function() {
    // Update map details with values from input fields
    document.getElementById('mapName').value = document.getElementById('mapNameInput').value;
    document.getElementById('version').value = document.getElementById('versionInput').value;
    document.getElementById('description').value = document.getElementById('descriptionInput').value;
    document.getElementById('developer').value = document.getElementById('developerInput').value;
    document.getElementById('mapId').value = document.getElementById('mapIdInput').value;
  
    // Export platforms
    exportPlatforms();
  
    // Close the export modal
    closeExportModal();
  });
// Event listener for export button click
exportButton.addEventListener('click', exportPlatforms);
