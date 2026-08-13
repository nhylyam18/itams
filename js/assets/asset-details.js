document.addEventListener('DOMContentLoaded', () => {
  const detailTitle = document.getElementById('detail-title');
  const detailStatus = document.getElementById('detail-status');
  const detailSummary = document.getElementById('detail-summary');
  const detailSections = document.getElementById('detail-sections');

  function safeText(value) {
    if (value === undefined || value === null || String(value).trim() === '') {
      return 'N/A';
    }
    return String(value);
  }

  function getAssets() {
    try {
      return JSON.parse(localStorage.getItem('itams-assets') || '[]');
    } catch (error) {
      return [];
    }
  }

  function getAssetFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const assetId = params.get('assetId');
    const records = getAssets();
    const asset = records.find((item) => item.assetId === assetId);

    if (asset) return asset;

    return {
      assetId: assetId || 'ITAMS-000381',
      deviceName: 'Lenovo ThinkPad E14',
      status: 'Assigned',
      hardwareType: 'Laptop',
      manufacturer: 'Lenovo',
      modelNumber: 'ThinkPad E14 Gen 5',
      serialNumber: 'LNV-43215',
      assetAccountable: 'IT Services',
      assignedTo: 'Maria Santos',
      assignedToEmail: 'maria.santos@phinmaed.com',
      buildingName: 'IT Building',
      floorNumber: '2',
      officeNumber: 'IT-204',
      position: 'IT Support Analyst',
      department: 'IT Services',
      purchaseDate: '2023-10-05',
      hardwareAge: '3 years',
      poNumber: 'PO-2048',
      warrantyYears: '3',
      processor: 'Intel Core i5-12400',
      numberOfCores: '6',
      memory: '16 GB',
      hardDiskSize: '512 GB SSD',
      operatingSystem: 'Windows 11 Pro',
      microsoftOffice: 'Microsoft Office 2021',
      adobeSoftware: 'Adobe Acrobat Reader',
      antivirus: 'Windows Defender',
      ipAddress: '192.168.14.42',
      wifiMac: 'AA:BB:CC:DD:EE:FF',
      lanMac: '00:1B:44:11:22:33',
      maintenanceHistory: [
        { title: 'Battery replacement', date: '2025-03-12' },
        { title: 'System diagnostics', date: '2025-06-22' }
      ],
      repairHistory: [
        { title: 'Keyboard replacement', date: '2024-11-09' }
      ],
      borrowingHistory: [
        { title: 'Loaned to Admin Office', date: '2025-01-15' }
      ],
      activityHistory: [
        { title: 'Asset assigned', date: '2024-02-14' },
        { title: 'Location updated', date: '2025-08-01' }
      ]
    };
  }

  function renderDetailField(label, value) {
    return `
      <div class="detail-field">
        <span>${label}</span>
        <strong>${safeText(value)}</strong>
      </div>
    `;
  }

  function renderHistoryList(items, title) {
    if (!items || items.length === 0) {
      return `
        <section class="detail-block">
          <h3>${title}</h3>
          <p class="empty-state">No records available.</p>
        </section>
      `;
    }

    return `
      <section class="detail-block">
        <h3>${title}</h3>
        <ul class="history-list">
          ${items.map((item) => `
            <li>
              <strong>${safeText(item.title)}</strong>
              <small>${safeText(item.date)}</small>
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  }

  function renderAsset() {
    const asset = getAssetFromUrl();

    if (detailTitle) {
      detailTitle.textContent = `${asset.assetId} | ${asset.deviceName}`;
    }

    if (detailStatus) {
      detailStatus.textContent = `Status: ${safeText(asset.status)}`;
    }

    if (detailSummary) {
      detailSummary.innerHTML = `
        <div class="detail-summary-card">
          <span class="detail-chip">${safeText(asset.hardwareType)}</span>
          <h2>${safeText(asset.deviceName)}</h2>
          <p>${safeText(asset.buildingName)} • ${safeText(asset.department)}</p>
        </div>
      `;
    }

    const blocks = [
      `
        <section class="detail-block">
          <h3>Basic Information</h3>
          <div class="detail-grid">
            ${renderDetailField('Device Name', asset.deviceName)}
            ${renderDetailField('School', asset.school)}
            ${renderDetailField('Hardware Type', asset.hardwareType)}
            ${renderDetailField('Manufacturer', asset.manufacturer)}
            ${renderDetailField('Model', asset.modelNumber)}
            ${renderDetailField('Serial Number', asset.serialNumber)}
            ${renderDetailField('Status', asset.status)}
          </div>
        </section>
      `,
      `
        <section class="detail-block">
          <h3>Accountability</h3>
          <div class="detail-grid">
            ${renderDetailField('Assigned To', asset.assignedTo)}
            ${renderDetailField('Email', asset.assignedToEmail)}
            ${renderDetailField('Asset Accountable', asset.assetAccountable)}
            ${renderDetailField('Department', asset.department)}
          </div>
        </section>
      `,
      `
        <section class="detail-block">
          <h3>Location</h3>
          <div class="detail-grid">
            ${renderDetailField('Building', asset.buildingName)}
            ${renderDetailField('Floor', asset.floorNumber)}
            ${renderDetailField('Office / Room', asset.officeNumber)}
            ${renderDetailField('Position', asset.position)}
            ${renderDetailField('Department', asset.department)}
          </div>
        </section>
      `,
      `
        <section class="detail-block">
          <h3>Purchase</h3>
          <div class="detail-grid">
            ${renderDetailField('Purchase Date', asset.purchaseDate)}
            ${renderDetailField('Year', asset.purchaseYear)}
            ${renderDetailField('Hardware Age', asset.hardwareAge)}
            ${renderDetailField('PO Number', asset.poNumber)}
            ${renderDetailField('Warranty', asset.warrantyYears)}
          </div>
        </section>
      `,
      `
        <section class="detail-block">
          <h3>Specifications</h3>
          <div class="detail-grid">
            ${renderDetailField('Processor', asset.processor)}
            ${renderDetailField('Cores', asset.numberOfCores)}
            ${renderDetailField('Memory', asset.memory)}
            ${renderDetailField('Storage', asset.hardDiskSize)}
            ${renderDetailField('RAID Level', asset.raidLevel)}
          </div>
        </section>
      `,
      `
        <section class="detail-block">
          <h3>Software</h3>
          <div class="detail-grid">
            ${renderDetailField('OS', asset.operatingSystem)}
            ${renderDetailField('Microsoft Office', asset.microsoftOffice)}
            ${renderDetailField('Adobe', asset.adobeSoftware)}
            ${renderDetailField('Antivirus', asset.antivirus)}
          </div>
        </section>
      `,
      renderHistoryList(asset.maintenanceHistory, 'Maintenance History'),
      renderHistoryList(asset.repairHistory, 'Repair History'),
      renderHistoryList(asset.borrowingHistory, 'Borrowing History'),
      renderHistoryList(asset.activityHistory, 'Activity History')
    ].join('');

    if (detailSections) {
      detailSections.innerHTML = blocks;
    }
  }

  renderAsset();
});
