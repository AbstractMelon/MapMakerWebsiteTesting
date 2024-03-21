const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const exportButton = document.getElementById('exportButton');

let platforms = [];

// Function to draw a platform on the canvas
function drawPlatform(x, y, width, height) {
  // Example: draw a rectangle representing the platform
  ctx.fillRect(x, y, width, height);
}

// Event listener to handle mouse click and draw platforms
canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Example: draw a platform at the clicked position
  drawPlatform(mouseX, mouseY, 50, 50);

  // Add the platform data to the platforms array
  platforms.push({
    transform: { x: mouseX, y: mouseY },
    size: { width: 10, height: 10 },
    radius: 1,
    rotation: 0,
    biome: "Plain",
    visibility: true,
    AntiLockPlatform: false,
    blank: false
  });
});

// Function to export platforms to JSON
function exportPlatforms() {
  const mapData = {
    version: "1.0",
    mapName: "Boplmap",
    description: "A Bopl Map",
    developer: "Abstractmelon",
    dateCreated: "2024-03-17",
    mapId: "1",
    siteVersion: "0.1",
    icon: "https://raw.githubusercontent/abstractmelon/boplmapmaker/main/images/icon.jpeg",
    platforms: platforms
  };

  const jsonData = JSON.stringify(mapData, null, 2);
  console.log(jsonData); // Output JSON to console (you can replace this with actual file download logic)
}

// Event listener for export button click
exportButton.addEventListener('click', exportPlatforms);
