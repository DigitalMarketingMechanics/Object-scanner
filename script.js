const video = document.getElementById("camera");
const startBtn = document.getElementById("startCamera");
const toggleFlashBtn = document.getElementById("toggleFlash");
const scanBtn = document.getElementById("scanObject");
const resultSection = document.getElementById("result");

let stream = null;
let track = null;
let torchOn = false;

// Start camera with rear camera preference
startBtn.onclick = async () => {
  try {
    // Try exact rear camera
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
  } catch (e) {
    // Fallback to any camera on failure
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      alert("Camera access denied or not available.");
      return;
    }
  }

  video.srcObject = stream;
  track = stream.getVideoTracks()[0];

  // Enable scan button
  scanBtn.disabled = false;

  // Check if flashlight/torch is supported
  const imageCapture = new ImageCapture(track);
  imageCapture.getPhotoCapabilities()
    .then(capabilities => {
      if (capabilities.torch || capabilities.fillLightMode?.includes("torch")) {
        toggleFlashBtn.disabled = false;
      } else {
        toggleFlashBtn.disabled = true;
      }
    })
    .catch(() => {
      toggleFlashBtn.disabled = true;
    });

  startBtn.disabled = true;
};

// Toggle torch (flashlight)
toggleFlashBtn.onclick = async () => {
  if (!track) return;

  torchOn = !torchOn;
  try {
    await track.applyConstraints({
      advanced: [{ torch: torchOn }]
    });
  } catch (err) {
    alert("Flashlight not supported on this device or browser.");
    toggleFlashBtn.disabled = true;
  }
};

// Simulated AI object scanning and showing results
scanBtn.onclick = () => {
  const simulatedObjects = [
    "Wireless Headphones",
    "Smartphone",
    "Backpack",
    "Running Shoes",
    "Wrist Watch"
  ];
  const detectedObject = simulatedObjects[Math.floor(Math.random() * simulatedObjects.length)];

  showLoading(detectedObject);

  setTimeout(() => displayResults(detectedObject), 1500);
};

function showLoading(object) {
  resultSection.innerHTML = `<p>Scanning object: <b>${object}</b>...</p>`;
}

function displayResults(object) {
  // Simulated offers with direct product search URLs + product images
  let offers = [
    {
      store: "Amazon",
      price: (100 + Math.random() * 900).toFixed(2),
      url: `https://www.amazon.in/s?k=${encodeURIComponent(object)}`,
      img: "https://images-na.ssl-images-amazon.com/images/I/61UdprqL7+L._AC_UL320_.jpg"
    },
    {
      store: "Flipkart",
      price: (90 + Math.random() * 850).toFixed(2),
      url: `https://www.flipkart.com/search?q=${encodeURIComponent(object)}`,
      img: "https://rukminim1.flixcart.com/image/200/200/jj5xhu80/speaker/c/m/x/-original-imafzqvwzyvzfmm9.jpeg"
    },
    {
      store: "Reliance Digital",
      price: (110 + Math.random() * 920).toFixed(2),
      url: `https://www.reliancedigital.in/search?q=${encodeURIComponent(object)}`,
      img: "https://rukminim1.flixcart.com/image/200/200/k92zhu80/mobile/i/g/x/-original-imafvdbmyhn3wpnd.jpeg"
    },
    {
      store: "eBay",
      price: (85 + Math.random() * 950).toFixed(2),
      url: `https://www.ebay.in/sch/i.html?_nkw=${encodeURIComponent(object)}`,
      img: "https://i.ebayimg.com/images/g/O9kAAOSwzQ5bOj9v/s-l1600.jpg"
    },
    {
      store: "Croma",
      price: (95 + Math.random() * 900).toFixed(2),
      url: `https://www.croma.com/search/?text=${encodeURIComponent(object)}`,
      img: "https://cdn.croma.com/image/upload/v1605300034/Croma%20Assets/Entertainment/Mobiles/Images/8936889277165.png"
    }
  ];

  offers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  resultSection.innerHTML = `
    <h3>Detected Object: ${object}</h3>
    <ul class="price-list">
      ${offers.map(o => `
        <li>
          <img src="${o.img}" alt="${o.store} product" loading="lazy" />
          <span>${o.store} – ₹${o.price}</span>
          <a href="${o.url}" target="_blank" rel="noopener noreferrer">Buy Now</a>
        </li>
      `).join('')}
    </ul>
    <p>Prices are simulated for demo purposes. Click each link to view actual products on the stores' websites.</p>
  `;
}
