const qrType = document.getElementById('qr-type');
const qrText = document.getElementById('qr-text');
const qrUrl = document.getElementById('qr-url');
const wifiSsid = document.getElementById('wifi-ssid');
const wifiPassword = document.getElementById('wifi-password');
const wifiHidden = document.getElementById('wifi-hidden');
const wifiEncryption = document.getElementById('wifi-encryption');
const vcardName = document.getElementById('vcard-name');
const vcardTel = document.getElementById('vcard-tel');
const vcardEmail = document.getElementById('vcard-email');
const qrLogoFile = document.getElementById('qr-logo-file');
const logoPreview = document.getElementById('logo-preview');
const logoPreviewContainer = document.getElementById('logo-preview-container');
const generateBtn = document.getElementById('generate-btn');
const qrcodeContainer = document.getElementById('qrcode-container');
const downloadBtn = document.getElementById('download-btn');

const generateView = document.getElementById('generate-view');
const historyView = document.getElementById('history-view');
const settingsView = document.getElementById('settings-view');
const scanView = document.getElementById('scan-view');

const mainTitle = document.getElementById('main-title');

const generateTab = document.getElementById('generate-tab');
const scanTab = document.getElementById('scan-tab');
const historyTab = document.getElementById('history-tab');
const settingsTab = document.getElementById('settings-tab');

const allTabs = document.querySelectorAll('.fixed a');

const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const historySearch = document.getElementById('history-search');

const colorDarkInput = document.getElementById('color-dark');
const colorLightInput = document.getElementById('color-light');
const saveSettingsBtn = document.getElementById('save-settings-btn');

const textInputDiv = document.getElementById('text-input');
const urlInputDiv = document.getElementById('url-input');
const wifiInputDiv = document.getElementById('wifi-input');
const vcardInputDiv = document.getElementById('vcard-input');

const scannedText = document.getElementById('scanned-text');
const scanResultDiv = document.getElementById('scan-result');
const rescanBtn = document.getElementById('rescan-btn');

let lastGeneratedQR = '';
let lastGeneratedData = {};
let html5QrCode = null;

function downloadImage(imageData, filename) {
  const link = document.createElement('a');
  link.href = imageData;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function stopScanner() {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      console.log("QR Code scanning stopped.");
    }).catch(err => {
      console.error("Failed to stop scanning.", err);
    });
  }
}

function hideAllViews() {
  generateView.classList.add('hidden');
  historyView.classList.add('hidden');
  settingsView.classList.add('hidden');
  scanView.classList.add('hidden');
}

function setActiveTab(activeTab) {
  allTabs.forEach(tab => {
    const icon = tab.querySelector('div');
    const text = tab.querySelector('p');
    if (tab === activeTab) {
      icon.classList.remove('text-inactive');
      icon.classList.add('text-active');
      text.classList.remove('text-inactive');
      text.classList.add('text-active');
    } else {
      icon.classList.remove('text-active');
      icon.classList.add('text-inactive');
      text.classList.remove('text-active');
      text.classList.add('text-inactive');
    }
  });
}

function showGenerateView() {
  stopScanner();
  hideAllViews();
  setActiveTab(generateTab);
  generateView.classList.remove('hidden');
  mainTitle.textContent = 'QR Code';
  document.title = 'QR Code - App';
}

function showScanView() {
  hideAllViews();
  setActiveTab(scanTab);
  scanView.classList.remove("hidden");
  
  scanResultDiv.classList.add("hidden");
  scannedText.textContent = "";
  mainTitle.textContent = "Scan QR Code";
  document.title = "Scan QR Code - App";
  
  startScanner();
  addTorchButton();
}

function showHistoryView() {
  stopScanner();
  hideAllViews();
  setActiveTab(historyTab);
  historyView.classList.remove('hidden');
  
  loadHistory();
  mainTitle.textContent = 'Generated History';
  document.title = 'Generated History - App';
}

function showSettingsView() {
  stopScanner();
  hideAllViews();
  setActiveTab(settingsTab);
  settingsView.classList.remove('hidden');
  loadSettings();
  mainTitle.textContent = 'Settings';
  document.title = 'Settings - App';
}

function getSettings() {
  const settings = JSON.parse(localStorage.getItem('qrSettings')) || {};
  return {
    colorDark: settings.colorDark || '#90EE90',
    colorLight: settings.colorLight || '#000000',
    logoDataUrl: settings.logoDataUrl || ''
  };
}

function loadSettings() {
  const settings = getSettings();
  colorDarkInput.value = settings.colorDark;
  colorLightInput.value = settings.colorLight;
  logoPreview.src = settings.logoDataUrl;
  updateLogoPreview();
}

function saveSettings() {
  const settings = {
    colorDark: colorDarkInput.value,
    colorLight: colorLightInput.value,
    logoDataUrl: logoPreview.src
  };
  localStorage.setItem('qrSettings', JSON.stringify(settings));
  alert('Settings saved!');
}

function getQRData() {
  const type = qrType.value;
  let data = { type: type, text: '' };

  switch(type) {
    case 'text':
      data.text = qrText.value.trim();
      break;
    case 'url':
      data.text = qrUrl.value.trim();
      break;
    case 'wifi':
      const ssid = wifiSsid.value.trim();
      const password = wifiPassword.value.trim();
      const hidden = wifiHidden.checked;
      const encryption = wifiEncryption.value;
      data.text = `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};`;
      data.wifi = { ssid, password, hidden, encryption };
      break;
    case 'vcard':
      const name = vcardName.value.trim();
      const tel = vcardTel.value.trim();
      const email = vcardEmail.value.trim();
      data.text = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${tel}\nEMAIL:${email}\nEND:VCARD`;
      data.vcard = { name, tel, email };
      break;
  }

  return data;
}

function generateQRCode() {
  const data = getQRData();
  const text = data.text;
  const settings = getSettings();

  if (text) {
    qrcodeContainer.innerHTML = '';

    const size = Math.min(window.innerWidth * 0.8, 256);
    const qrcode = new QRCode(qrcodeContainer, {
      text: text,
      width: size,
      height: size,
      colorDark: settings.colorDark,
      colorLight: settings.colorLight,
    });
    
    setTimeout(() => {
      const canvas = qrcodeContainer.querySelector('canvas');
      if (canvas) {
        const context = canvas.getContext('2d');
        const finalCanvas = document.createElement('canvas');
        const finalContext = finalCanvas.getContext('2d');
        finalCanvas.width = size;
        finalCanvas.height = size;
        finalContext.drawImage(canvas, 0, 0, size, size);

        if (settings.logoDataUrl) {
          const logo = new Image();
          logo.onload = () => {
            const logoSize = size / 4;
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;
            finalContext.fillStyle = settings.colorLight;
            finalContext.fillRect(x, y, logoSize, logoSize);
            finalContext.drawImage(logo, x, y, logoSize, logoSize);
            finalizeQR(finalCanvas, data);
          };
          logo.onerror = () => {
            console.error('Failed to load logo image.');
            finalizeQR(finalCanvas, data);
          };
          logo.src = settings.logoDataUrl;
        } else {
          finalizeQR(finalCanvas, data);
        }
      }
    }, 100);
  } else {
    qrcodeContainer.innerHTML = '';
    downloadBtn.classList.add('hidden');
  }
}

function finalizeQR(canvas, data) {
  lastGeneratedQR = canvas.toDataURL('image/png');
  lastGeneratedData = data;
  
  qrcodeContainer.innerHTML = '';
  const img = new Image();
  img.src = lastGeneratedQR;
  img.classList.add('w-64', 'h-64');
  qrcodeContainer.appendChild(img);
  
  downloadBtn.classList.remove('hidden');
  saveToHistory(lastGeneratedData, lastGeneratedQR);
}

function saveToHistory(data, imageData) {
  let history = JSON.parse(localStorage.getItem('qrHistory')) || [];
  const entry = { data: data, imageData: imageData, timestamp: new Date().toISOString() };
  history.unshift(entry);
  localStorage.setItem('qrHistory', JSON.stringify(history));
}

function loadHistory(searchTerm = '') {
  historyList.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('qrHistory')) || [];
  
  if (history.length === 0) {
    historyList.innerHTML = '<p class="text-center text-[#49739c]">No QR codes generated yet.</p>';
    return;
  }

  const filteredHistory = history.filter(entry => entry.data.text.toLowerCase().includes(searchTerm.toLowerCase()));

  if (filteredHistory.length === 0 && searchTerm) {
    historyList.innerHTML = '<p class="text-center text-[#49739c]">No results found.</p>';
    return;
  }

  filteredHistory.forEach(entry => {
    const item = document.createElement('div');
    item.classList.add('history-item', 'flex', 'items-center', 'justify-between', 'bg-white', 'p-4', 'rounded-lg', 'shadow-sm');

    const textWrapper = document.createElement('div');
    textWrapper.classList.add('flex-1', 'mr-4');
    textWrapper.innerHTML = `
      <p class="text-[#0d141c] text-sm font-medium truncate">${entry.data.text}</p>
      <p class="text-[#49739c] text-xs">${entry.data.type.toUpperCase()} | ${new Date(entry.timestamp).toLocaleString()}</p>
    `;
    item.appendChild(textWrapper);

    const qrWrapper = document.createElement('div');
    qrWrapper.classList.add('qr-wrapper', 'w-12', 'h-12', 'flex-shrink-0');
    const img = document.createElement('img');
    img.src = entry.imageData;
    img.classList.add('w-full', 'h-full');
    qrWrapper.appendChild(img);
    item.appendChild(qrWrapper);

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group', 'flex', 'gap-2', 'ml-4', 'flex-shrink-0');
    const regenerateBtn = document.createElement('button');
    regenerateBtn.classList.add('bg-[#e2e8f0]', 'text-[#0d141c]', 'text-sm', 'p-2', 'rounded-lg');
    regenerateBtn.textContent = 'Re-generate';
    regenerateBtn.addEventListener('click', () => {
      populateGenerator(entry.data);
    });
    buttonGroup.appendChild(regenerateBtn);

    const downloadLink = document.createElement('button');
    downloadLink.classList.add('bg-[#14b8a6]', 'text-white', 'text-sm', 'p-2', 'rounded-lg');
    downloadLink.textContent = 'Download';
    downloadLink.addEventListener('click', () => {
      downloadImage(entry.imageData, `qrcode_${new Date().getTime()}.png`);
    });
    buttonGroup.appendChild(downloadLink);
    item.appendChild(buttonGroup);

    historyList.appendChild(item);
  });
}

function populateGenerator(data) {
  qrType.value = data.type;
  updateGeneratorView();
  
  switch(data.type) {
    case 'text':
      qrText.value = data.text;
      break;
    case 'url':
      qrUrl.value = data.text;
      break;
    case 'wifi':
      wifiSsid.value = data.wifi.ssid;
      wifiPassword.value = data.wifi.password;
      wifiHidden.checked = data.wifi.hidden;
      wifiEncryption.value = data.wifi.encryption;
      break;
    case 'vcard':
      vcardName.value = data.vcard.name;
      vcardTel.value = data.vcard.tel;
      vcardEmail.value = data.vcard.email;
      break;
  }

  showGenerateView();
}

function clearHistory() {
  localStorage.removeItem('qrHistory');
  loadHistory();
}

function updateGeneratorView() {
  const type = qrType.value;
  const inputDivs = [textInputDiv, urlInputDiv, wifiInputDiv, vcardInputDiv];
  
  inputDivs.forEach(div => div.classList.add('hidden'));

  switch(type) {
    case 'text':
      textInputDiv.classList.remove('hidden');
      break;
    case 'url':
      urlInputDiv.classList.remove('hidden');
      break;
    case 'wifi':
      wifiInputDiv.classList.remove('hidden');
      break;
    case 'vcard':
      vcardInputDiv.classList.remove('hidden');
      break;
  }
}

function updateLogoPreview() {
  if (qrLogoFile.files && qrLogoFile.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      logoPreview.src = e.target.result;
      logoPreviewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(qrLogoFile.files[0]);
  } else {
    logoPreviewContainer.classList.add('hidden');
    logoPreview.src = '';
  }
}

function startScanner() {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      console.log("Previous scanner stopped successfully.");
      startNewScanner();
    }).catch(err => {
      console.error("Failed to stop previous scanner.", err);
      startNewScanner();
    });
  } else {
    startNewScanner();
  }
}

function startNewScanner() {
  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    showTorchButtonIfSupported: true
  };
  html5QrCode = new Html5Qrcode("reader");

  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    console.log(`Scan result: ${decodedText}`);
    scannedText.textContent = decodedText;
    scanResultDiv.classList.remove("hidden");
    stopScanner();
  };

  Html5Qrcode.getCameras().then((devices) => {
    if (devices && devices.length) {
      html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .catch((err) => {
          console.error("Failed to start scanning.", err);
          scannedText.textContent = `Error: Could not start camera. Please ensure you have granted camera access.`;
          scanResultDiv.classList.remove("hidden");
        });
    } else {
      console.error("No cameras found.");
      scannedText.textContent = "Error: No cameras found on this device.";
      scanResultDiv.classList.remove("hidden");
    }
  }).catch((err) => {
    console.error("Error getting cameras.", err);
    scannedText.textContent = "Error: Could not access camera devices.";
    scanResultDiv.classList.remove("hidden");
  });
}

function toggleTorch(isOn) {
  if (html5QrCode && (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING || html5QrCode.getState() === Html5QrcodeScannerState.PAUSED)) {
    const constraints = {
      advanced: [{ torch: isOn }]
    };
    html5QrCode.applyVideoConstraints(constraints)
      .then(() => {
        console.log(`Torch ${isOn ? "on" : "off"} successfully.`);
      })
      .catch((err) => {
        console.error(`Failed to toggle torch: ${err}`);
      });
  }
}

function addTorchButton() {
  const torchButton = document.createElement("button");
  torchButton.textContent = "Toggle Torch";
  torchButton.classList.add("flex", "cursor-pointer", "items-center", "justify-center", "overflow-hidden", "rounded-lg", "h-10", "px-4", "bg-[#0d80f2]", "text-slate-50", "text-sm", "font-bold", "leading-normal", "tracking-[0.015em]", "mt-4");
  torchButton.addEventListener("click", () => {
    if (html5QrCode) {
      html5QrCode.getRunningTrackSettings()
        .then((settings) => {
          const isTorchOn = settings.torch === true;
          toggleTorch(!isTorchOn);
        })
        .catch((err) => {
          console.error("Could not check torch state:", err);
          toggleTorch(true);
        });
    }
  });
  if (!document.querySelector("#torch-button")) {
    torchButton.id = "torch-button";
    scanView.appendChild(torchButton);
  }
}

generateTab.addEventListener('click', showGenerateView);
scanTab.addEventListener('click', showScanView);
historyTab.addEventListener('click', showHistoryView);
settingsTab.addEventListener('click', showSettingsView);

generateBtn.addEventListener('click', generateQRCode);
downloadBtn.addEventListener('click', () => {
  if (lastGeneratedQR) {
    downloadImage(lastGeneratedQR, 'qrcode.png');
  }
});
clearHistoryBtn.addEventListener('click', clearHistory);
rescanBtn.addEventListener('click', showScanView);

qrType.addEventListener('change', updateGeneratorView);
qrLogoFile.addEventListener('change', updateLogoPreview);
historySearch.addEventListener('input', (e) => loadHistory(e.target.value));
saveSettingsBtn.addEventListener('click', saveSettings);

showGenerateView();
