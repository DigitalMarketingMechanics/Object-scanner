const video = document.getElementById("camera");
const startBtn = document.getElementById("startCamera");
const scanBtn = document.getElementById("scanObject");
const resultSection = document.getElementById("result");

let stream = null;

// Start camera
startBtn.onclick = async function() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    scanBtn.disabled = false;
    startBtn.disabled = true;
  } catch (e) {
    alert("Camera access denied or not available.");
  }
};

// Simulate real AI scanning (replace with your real detection API for production)
scanBtn.onclick = () => {
  const objects = ["Mug", "Laptop", "Shoes", "Book", "Smartphone"];
  const detected = objects[Math.floor(Math.random()*objects.length)];
  showLoading(detected);
  setTimeout(() => displayResults(detected), 1300);
};

function showLoading(obj) {
  resultSection.innerHTML = `<p>Scanning object: <b>${obj}</b>...</p>`;
}

function displayResults(obj) {
  let offers = [
    {store: "Amazon",   price: (500 + Math.random()*1000).toFixed(2), url:"https://amazon.com/"},
    {store: "Flipkart", price: (480 + Math.random()*1200).toFixed(2), url:"https://flipkart.com/"},
    {store: "Reliance Digital", price: (520 + Math.random()*950).toFixed(2), url:"https://reliancedigital.in/"},
    {store: "eBay",     price: (450 + Math.random()*1050).toFixed(2), url:"https://ebay.com/"},
    {store: "Croma",    price: (540 + Math.random()*1100).toFixed(2), url:"https://croma.com/"}
  ];
  offers.sort((a, b) => a.price - b.price);

  resultSection.innerHTML = `
    <h3>Detected: ${obj}</h3>
    <ul class="price-list">
      ${offers.map(o =>
        `<li>
          <span>${o.store} – ₹${o.price}</span>
          <a href="${o.url}?q=${encodeURIComponent(obj)}" target="_blank" rel="noopener">Buy Now</a>
        </li>`
      ).join('')}
    </ul>
    <p>Prices are simulated for demo. Click to view in store.</p>
  `;
}
