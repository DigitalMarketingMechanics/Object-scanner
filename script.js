const video = document.getElementById("camera");
const startBtn = document.getElementById("startCamera");
const toggleFlashBtn = document.getElementById("toggleFlash");
const scanBtn = document.getElementById("scanObject");
const resultSection = document.getElementById("result");

let stream = null;
let track = null;
let torchOn = false;

// Start camera with back camera if available
startBtn.onclick = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
  } catch (e) {
    // fallback to any camera
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      alert("Camera access denied or not available.");
      return;
    }
  }

  video.srcObject = stream;
  track = stream.getVideoTracks()[0];

  scanBtn.disabled = false;
  startBtn.disabled = true;

  // Check torch support
  if ("ImageCapture" in window && track) {
    try {
      const imageCapture = new ImageCapture(track);
      const capabilities = await imageCapture.getPhotoCapabilities();
      if (capabilities.torch || (capabilities.fillLightMode && capabilities.fillLightMode.includes("torch"))) {
        toggleFlashBtn.disabled = false;
      } else {
        toggleFlashBtn.disabled = true;
      }
    } catch {
      toggleFlashBtn.disabled = true;
    }
  } else {
    toggleFlashBtn.disabled = true;
  }
};

// Toggle flashlight manually
toggleFlashBtn.onclick = async () => {
  if (!track) return;

  torchOn = !torchOn;

  try {
    await track.applyConstraints({
      advanced: [{ torch: torchOn }]
    });
    toggleFlashBtn.textContent = torchOn ? "Flashlight ON" : "Toggle Flashlight";
  } catch (err) {
    alert("Flashlight not supported on this device or browser.");
    toggleFlashBtn.disabled = true;
  }
};

// Scan object — auto flashlight ON during scan, OFF after
scanBtn.onclick = async () => {
  if (!track) {
    alert("Camera not started.");
    return;
  }

  // Try turning ON flashlight automatically for scan
  try {
    await track.applyConstraints({ advanced: [{ torch: true }] });
    torchOn = true;
    toggleFlashBtn.textContent = "Flashlight ON";
  } catch (_) {
    // ignore if torch unsupported
  }

  const simulatedObjects = [
    "Wireless Headphones",
    "Smartphone",
    "Backpack",
    "Running Shoes",
    "Wrist Watch"
  ];

  const detectedObject = simulatedObjects[Math.floor(Math.random() * simulatedObjects.length)];
  showLoading(detectedObject);

  // Simulate scanning delay
  setTimeout(async () => {
    displayResults(detectedObject);

    // Turn OFF flashlight automatically when done scanning
    try {
      await track.applyConstraints({ advanced: [{ torch: false }] });
      torchOn = false;
      toggleFlashBtn.textContent = "Toggle Flashlight";
    } catch (_) {
      // ignore errors
    }
  }, 2000);
};

function showLoading(objectName) {
  resultSection.innerHTML = `<p>Scanning object: <b>${objectName}</b>...</p>`;
}

function displayResults(objectName) {
  const offers = [
    {
      store: "Amazon",
      price: (100 + Math.random() * 900).toFixed(2),
      url: `https://www.amazon.in/s?k=${encodeURIComponent(objectName)}`,
      img: "https://images-na.ssl-images-amazon.com/images/I/61UdprqL7+L._AC_UL320_.jpg"
    },
    {
      store: "Flipkart",
      price: (90 + Math.random() * 850).toFixed(2),
      url: `https://www.flipkart.com/search?q=${encodeURIComponent(objectName)}`,
      img: "https://rukminim1.flixcart.com/image/200/200/jj5xhu80/speaker/c/m/x/-original-imafzqvwzyvzfmm9.jpeg"
    },
    {
      store: "Reliance Digital",
      price: (110 + Math.random() * 920).toFixed(2),
      url: `https://www.reliancedigital.in/search?q=${encodeURIComponent(objectName)}`,
      img: "https://rukminim1.flixcart.com/image/200/200/k92zhu80/mobile/i/g/x/-original-imafvdbmyhn3wpnd.jpeg"
    },
    {
      store: "eBay",
      price: (85 + Math.random() * 950).toFixed(2),
      url: `https://www.ebay.in/sch/i.html?_nkw=${encodeURIComponent(objectName)}`,
      img: "https://i.ebayimg.com/images/g/O9kAAOSwzQ5bOj9v/s-l1600.jpg"
    },
    {
      store: "Croma",
      price: (95 + Math.random() * 900).toFixed(2),
      url: `https://www.croma.com/search/?text=${encodeURIComponent(objectName)}`,
      img: "https://cdn.croma.com/image/upload/v1605300034/Croma%20Assets/Entertainment/Mobiles/Images/8936889277165.png"
    }
  ];

  offers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  resultSection.innerHTML = `
    <h3>Detected Object: ${objectName}</h3>
    <ul class="price-list">
      ${offers.map(o => `
        <li>
          <img src="${o.img}" alt="${o.store} product" loading="lazy" />
          <span>${o.store} – ₹${o.price}</span>
          <a href="${o.url}" target="_blank" rel="noopener noreferrer" aria-label="Buy ${objectName} from ${o.store}">Buy Now</a>
        </li>
      `).join('')}
    </ul>
    <p>Prices are simulated for demo. Click links to view actual products on store sites.</p>
  `;
}
