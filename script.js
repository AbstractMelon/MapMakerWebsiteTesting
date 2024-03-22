// JavaScript
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const exportButton = document.getElementById('exportButton');

let platforms = [];
let isDrawing = false;
let startX, startY, currentX, currentY;
let radius = 0.5; // Default radius

// Function to draw a platform (cube) on the canvas
function drawCube(startX, startY, endX, endY, radius) {
  const width = endX - startX;
  const height = endY - startY;

  // Calculate rounded corner radius
  const minDimension = Math.min(width, height);
  const maxRadius = minDimension / 2;
  const roundedRadius = radius * maxRadius;

  ctx.beginPath();
  ctx.moveTo(startX + roundedRadius, startY);
  ctx.arcTo(endX, startY, endX, endY, roundedRadius);
  ctx.arcTo(endX, endY, startX, endY, roundedRadius);
  ctx.arcTo(startX, endY, startX, startY, roundedRadius);
  ctx.arcTo(startX, startY, endX, startY, roundedRadius);
  ctx.closePath();
  ctx.fill();
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
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Redraw previous platforms
  for (const platform of platforms) {
    drawCube(platform.transform.x, platform.transform.y, platform.transform.x + platform.size.width, platform.transform.y + platform.size.height, platform.radius);
  }

  drawCube(startX, startY, currentX, currentY, radius);
});

// Event listener to handle mouse up and stop drawing
canvas.addEventListener('mouseup', function(event) {
  if (!isDrawing) return;
  isDrawing = false;
  platforms.push({
    transform: { x: startX, y: startY },
    size: { width: currentX - startX, height: currentY - startY },
    radius: radius,
    biome: "Plain",
    visibility: true,
    AntiLockPlatform: false,
    blank: false
  });
});

// Event listener to handle scroll wheel and change the radius
canvas.addEventListener('wheel', function(event) {
  if (event.deltaY > 0) {
    // Scrolling down, decrease radius
    radius -= 0.1; // Decrease by 0.1
    if (radius < 0.1) radius = 0.05; // Minimum radius
  } else {
    // Scrolling up, increase radius
    radius += 0.1; // Increase by 0.1
    if (radius > 1) radius = 1; // Maximum radius
  }
  event.preventDefault(); // Prevent default scroll behavior
});

// Function to export platforms to .boplmap file
// Function to export platforms to .boplmap file
// Function to export platforms to .boplmap file
// Function to export platforms to .boplmap file
// Function to export platforms to .boplmap file
function exportPlatforms() {
    // Adjust platform data before exporting
    const adjustedPlatforms = platforms.map(platform => {
      return {
        transform: { 
          x: platform.transform.x / 15, 
          y: platform.transform.y / 15 
        },
        size: { 
          width: platform.size.width / 15, 
          height: platform.size.height / 15 
        },
        radius: platform.radius,
        biome: platform.biome,
        visibility: platform.visibility,
        AntiLockPlatform: platform.AntiLockPlatform,
        blank: platform.blank
      };
    });
  
    const mapData = {
      version: document.getElementById('version').value,
      mapName: document.getElementById('mapName').value,
      description: document.getElementById('description').value,
      developer: document.getElementById('developer').value,
      dateCreated: new Date().toISOString().slice(0, 10),
      mapId: document.getElementById('mapId').value,
      siteVersion: "0.1",
      icon: "https://raw.githubusercontent/abstractmelon/boplmapmaker/main/images/icon.jpeg",
      platforms: adjustedPlatforms // Use adjusted platform data
    };
  
    const jsonData = JSON.stringify(mapData, null, 2);
  
    // Create a Blob object containing the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });
  
    // Create a download link for the Blob
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'platforms.json'; // Name of the downloaded file
    link.click();
  
    // Clean up
    window.URL.revokeObjectURL(link.href);
  }
  
  
  // Event listener for export button click
  exportButton.addEventListener('click', exportPlatforms);
