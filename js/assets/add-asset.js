document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('asset-modal');
  const openButton = document.getElementById('open-asset-modal');
  const closeButtons = document.querySelectorAll('[data-close-asset-modal], #close-asset-modal');
  const form = document.getElementById('asset-form');
  const hardwareType = document.getElementById('hardware-type');
  const purchaseDate = document.getElementById('purchase-date');
  const purchaseYear = document.getElementById('purchase-year');
  const hardwareAge = document.getElementById('hardware-age');
  const statusField = document.getElementById('status');
  const successState = document.getElementById('asset-success');
  const createdAssetId = document.getElementById('created-asset-id');
  const viewAssetLink = document.getElementById('view-asset-link');
  const viewQrButton = document.getElementById('view-qr-button');
  const printLabelButton = document.getElementById('print-label-button');

  if (statusField && !statusField.value) {
    statusField.value = 'Available';
  }

  function openModal() {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updatePurchaseMeta() {
    if (!purchaseDate || !purchaseYear || !hardwareAge) return;

    if (purchaseDate.value) {
      const purchase = new Date(`${purchaseDate.value}T00:00:00`);
      const year = purchase.getFullYear();
      purchaseYear.value = year;

      const today = new Date();
      let ageYears = today.getFullYear() - year;

      hardwareAge.value = ageYears >= 0 ? `${ageYears} year${ageYears === 1 ? '' : 's'}` : 'New';
      return;
    }

    purchaseYear.value = '';
    hardwareAge.value = 'N/A';
  }

  function updateConditionalSections() {
    const type = hardwareType ? hardwareType.value : 'Laptop';
    const visibleTypes = {
      Laptop: ['Laptop', 'Desktop', 'Network Device', 'Server'],
      Desktop: ['Laptop', 'Desktop', 'Network Device', 'Server'],
      'Network Device': ['Laptop', 'Desktop', 'Network Device', 'Server'],
      Server: ['Server', 'Laptop', 'Desktop', 'Network Device'],
      Printer: ['Printer'],
      'Other IT Equipment': ['Other IT Equipment']
    };

    document.querySelectorAll('.conditional-section').forEach((section) => {
      const allowed = (section.dataset.showFor || '').split(',').map((value) => value.trim());
      const shouldShow = allowed.includes(type) || (type === 'Laptop' && allowed.includes('Laptop')) || (type === 'Desktop' && allowed.includes('Desktop')) || (type === 'Server' && allowed.includes('Server')) || (type === 'Network Device' && allowed.includes('Network Device'));
      section.hidden = !shouldShow;
    });

    const network = document.querySelector('[data-show-for="Laptop,Desktop,Network Device,Server"]');
    if (network) {
      network.hidden = !['Laptop', 'Desktop', 'Network Device', 'Server'].includes(type);
    }

    const software = document.querySelector('[data-show-for="Laptop,Desktop,Server,Network Device"]');
    if (software) {
      software.hidden = !['Laptop', 'Desktop', 'Server', 'Network Device'].includes(type);
    }

    const hardwareSpecs = document.querySelectorAll('[data-show-for="Laptop,Desktop,Server,Network Device"]').length > 1 ? document.querySelectorAll('[data-show-for="Laptop,Desktop,Server,Network Device"]')[1] : null;
    if (hardwareSpecs) {
      hardwareSpecs.hidden = !['Laptop', 'Desktop', 'Server', 'Network Device'].includes(type);
    }
  }

  function getAssetRecords() {
    try {
      return JSON.parse(localStorage.getItem('itams-assets') || '[]');
    } catch (error) {
      return [];
    }
  }

  function saveAssetRecords(records) {
    localStorage.setItem('itams-assets', JSON.stringify(records));
  }

  function generateAssetId() {
    const assetRecords = getAssetRecords();
    const lastNumber = assetRecords.reduce((highest, record) => {
      const match = String(record.assetId || '').match(/ITAMS-(\d+)/);
      if (!match) return highest;
      return Math.max(highest, Number(match[1]));
    }, 380);

    return `ITAMS-${String(lastNumber + 1).padStart(6, '0')}`;
  }

  function normalizeValue(value) {
    if (value === undefined || value === null) return 'N/A';
    const trimmed = String(value).trim();
    return trimmed || 'N/A';
  }

  function validateForm() {
    const requiredFields = [document.getElementById('device-name'), document.getElementById('hardware-type'), document.getElementById('status')];
    for (const field of requiredFields) {
      if (field && !field.value.trim()) {
        field.focus();
        return false;
      }
    }

    const ipValue = document.getElementById('ip-address')?.value.trim();
    if (ipValue && ipValue.toUpperCase() !== 'N/A' && !/^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/.test(ipValue)) {
      window.alert('Please enter a valid IP address or use N/A.');
      return false;
    }

    const wifiMac = document.getElementById('wifi-mac')?.value.trim();
    if (wifiMac && wifiMac.toUpperCase() !== 'N/A' && !/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(wifiMac)) {
      window.alert('Please enter a valid WiFi MAC address or use N/A.');
      return false;
    }

    const lanMac = document.getElementById('lan-mac')?.value.trim();
    if (lanMac && lanMac.toUpperCase() !== 'N/A' && !/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(lanMac)) {
      window.alert('Please enter a valid LAN MAC address or use N/A.');
      return false;
    }

    return true;
  }

  function resetForm() {
    if (form) form.reset();
    if (statusField) statusField.value = 'Available';
    if (purchaseYear) purchaseYear.value = '';
    if (hardwareAge) hardwareAge.value = 'N/A';
    if (hardwareType) hardwareType.value = 'Laptop';
    updateConditionalSections();
  }

  function showSuccess(assetId) {
    if (!successState || !createdAssetId || !viewAssetLink) return;

    createdAssetId.textContent = assetId;
    viewAssetLink.href = `asset-details.html?assetId=${encodeURIComponent(assetId)}`;
    successState.classList.remove('hidden');
    successState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function makeQrLabel(assetId) {
    const qrHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 24px; text-align: center;">
          <h2 style="letter-spacing: 0.12em; margin-bottom: 12px;">ITAMS</h2>
          <div style="border: 2px solid #0F0101; padding: 18px; display: inline-block; border-radius: 12px;">
            <div style="font-size: 52px; line-height: 1;">◼◼</div>
          </div>
          <p style="font-size: 20px; font-weight: bold; margin: 18px 0 8px;">${assetId}</p>
          <small>ITAMS asset reference</small>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Your browser blocked the print preview. Please allow pop-ups and try again.');
      return;
    }

    printWindow.document.write(qrHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const assetId = generateAssetId();
    const payload = {
      assetId,
      assetUrl: `/assets/${assetId}`,
      deviceName: normalizeValue(document.getElementById('device-name')?.value),
      school: normalizeValue(document.getElementById('school')?.value),
      hardwareType: normalizeValue(document.getElementById('hardware-type')?.value),
      status: normalizeValue(document.getElementById('status')?.value),
      assetAccountable: normalizeValue(document.getElementById('asset-accountable')?.value),
      assignedTo: normalizeValue(document.getElementById('assigned-to')?.value),
      assignedToEmail: normalizeValue(document.getElementById('assigned-to-email')?.value),
      buildingName: normalizeValue(document.getElementById('building-name')?.value),
      floorNumber: normalizeValue(document.getElementById('floor-number')?.value),
      officeNumber: normalizeValue(document.getElementById('office-number')?.value),
      position: normalizeValue(document.getElementById('position')?.value),
      department: normalizeValue(document.getElementById('department')?.value),
      manufacturer: normalizeValue(document.getElementById('manufacturer')?.value),
      modelNumber: normalizeValue(document.getElementById('model-number')?.value),
      serialNumber: normalizeValue(document.getElementById('serial-number')?.value),
      phinmaAssetTag: normalizeValue(document.getElementById('phinma-asset-tag')?.value),
      usage: normalizeValue(document.getElementById('usage')?.value),
      ipAddress: normalizeValue(document.getElementById('ip-address')?.value),
      wifiMac: normalizeValue(document.getElementById('wifi-mac')?.value),
      lanMac: normalizeValue(document.getElementById('lan-mac')?.value),
      purchaseDate: normalizeValue(document.getElementById('purchase-date')?.value),
      purchaseYear: normalizeValue(document.getElementById('purchase-year')?.value),
      hardwareAge: normalizeValue(document.getElementById('hardware-age')?.value),
      poNumber: normalizeValue(document.getElementById('po-number')?.value),
      warrantyYears: normalizeValue(document.getElementById('warranty-years')?.value),
      operatingSystem: normalizeValue(document.getElementById('operating-system')?.value),
      osLicenseType: normalizeValue(document.getElementById('os-license-type')?.value),
      microsoftOffice: normalizeValue(document.getElementById('microsoft-office')?.value),
      officeLicenseType: normalizeValue(document.getElementById('office-license-type')?.value),
      adobeSoftware: normalizeValue(document.getElementById('adobe-software')?.value),
      adobeLicenseType: normalizeValue(document.getElementById('adobe-license-type')?.value),
      spiceworks: normalizeValue(document.getElementById('spiceworks')?.value),
      remoteUtilities: normalizeValue(document.getElementById('remote-utilities')?.value),
      antivirus: normalizeValue(document.getElementById('antivirus')?.value),
      serverStatus: normalizeValue(document.getElementById('server-status')?.value),
      outOfBandIp: normalizeValue(document.getElementById('out-of-band-ip')?.value),
      hypervisorHostname: normalizeValue(document.getElementById('hypervisor-hostname')?.value),
      fqdn: normalizeValue(document.getElementById('fqdn')?.value),
      serverPurpose: normalizeValue(document.getElementById('server-purpose')?.value),
      processor: normalizeValue(document.getElementById('processor')?.value),
      numberOfCores: normalizeValue(document.getElementById('number-of-cores')?.value),
      memory: normalizeValue(document.getElementById('memory')?.value),
      hardDiskSize: normalizeValue(document.getElementById('hard-disk-size')?.value),
      raidLevel: normalizeValue(document.getElementById('raid-level')?.value),
      createdAt: new Date().toISOString()
    };

    const records = getAssetRecords();
    records.push(payload);
    saveAssetRecords(records);

    showSuccess(assetId);
    resetForm();
  }

  if (openButton) {
    openButton.addEventListener('click', openModal);
  }

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  if (hardwareType) {
    hardwareType.addEventListener('change', updateConditionalSections);
  }

  if (purchaseDate) {
    purchaseDate.addEventListener('change', updatePurchaseMeta);
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  if (viewQrButton) {
    viewQrButton.addEventListener('click', () => {
      const assetId = createdAssetId?.textContent || 'ITAMS-000000';
      const qrWindow = window.open('', '_blank');
      if (!qrWindow) {
        alert('Please allow pop-ups to view the QR code.');
        return;
      }

      qrWindow.document.write(`
        <html>
          <head><title>${assetId} QR</title></head>
          <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial,sans-serif;background:#f8f5f5;">
            <div style="padding:32px;border-radius:18px;background:#fff;border:1px solid #ddd;text-align:center;">
              <h2 style="margin:0 0 8px; letter-spacing:0.12em;">ITAMS</h2>
              <div style="font-size:72px; margin:18px 0;">◼◼</div>
              <p style="font-size:22px; font-weight:bold; margin:0;">${assetId}</p>
              <p style="margin-top:12px; color:#555;">Asset URL: /assets/${assetId}</p>
            </div>
          </body>
        </html>
      `);
      qrWindow.document.close();
    });
  }

  if (printLabelButton) {
    printLabelButton.addEventListener('click', () => {
      const assetId = createdAssetId?.textContent || 'ITAMS-000000';
      makeQrLabel(assetId);
    });
  }

  updateConditionalSections();
  updatePurchaseMeta();
});
