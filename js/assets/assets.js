document.addEventListener('DOMContentLoaded', () => {
  const assetList = document.getElementById('assets-list');

  function getAssets() {
    try {
      return JSON.parse(localStorage.getItem('itams-assets') || '[]');
    } catch (error) {
      return [];
    }
  }

  function renderAssets() {
    if (!assetList) return;

    const assets = getAssets();
    if (!assets.length) {
      assetList.innerHTML = `
        <div class="empty-asset-state">
          <h3>No assets recorded yet.</h3>
          <p>Use the New Asset button to add the first ITSD inventory record.</p>
        </div>
      `;
      return;
    }

    assetList.innerHTML = assets.map((asset) => {
      const warrantyText = asset.warrantyYears && String(asset.warrantyYears).toUpperCase() !== 'N/A' ? `${asset.warrantyYears} years` : 'N/A';

      return `
        <article class="asset-card">
          <div class="asset-card-header">
            <div>
              <span class="asset-id">${asset.assetId || 'ITAMS-000000'}</span>
              <h3>${asset.deviceName || 'Unnamed Device'}</h3>
            </div>
            <span class="status-pill ${String(asset.status || 'Available').toLowerCase().replace(/\s+/g, '-')}">${asset.status || 'Available'}</span>
          </div>

          <div class="asset-card-body">
            <p><strong>Hardware Type:</strong> ${asset.hardwareType || 'N/A'}</p>
            <p><strong>Assigned To:</strong> ${asset.assignedTo || 'N/A'}</p>
            <p><strong>Location:</strong> ${asset.buildingName || 'N/A'} / ${asset.department || 'N/A'}</p>
            <p><strong>Warranty:</strong> ${warrantyText}</p>
          </div>

          <div class="asset-action-row">
            <a href="asset-details.html?assetId=${encodeURIComponent(asset.assetId || 'ITAMS-000000')}" class="secondary-button small-button">View record</a>
          </div>
        </article>
      `;
    }).join('');
  }

  renderAssets();
});
