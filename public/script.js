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