const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Images will be temporarily stored in the 'uploads/' directory

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create an uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// POST endpoint for scanning objects
app.post('/scan', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const imagePath = req.file.path; // Path to the uploaded image

    try {
        // --- Placeholder for Object Recognition Logic ---
        // In a real application, you would send `imagePath` to an ML model
        // (e.g., a Python service, a cloud AI API like Google Cloud Vision,
        // or a local TensorFlow.js model if running entirely client-side/Node.js with specific libraries).

        // For now, let's simulate a recognition result:
        const recognizedObject = {
            name: 'Generic Gadget', // Placeholder: This would be the ML model's output
            confidence: 0.85,      // Placeholder: Confidence score from the ML model
        };

        // --- Placeholder for Online Store Product Search Logic ---
        // This is where you would call external APIs (e.g., Google Shopping API, specific retailer APIs)
        // or scrape websites based on `recognizedObject.name`.
        // Remember to handle API keys, rate limits, and terms of service.
        // Web scraping should be done ethically and legally (check website's robots.txt and terms).

        // For demonstration, let's simulate some product data:
        const products = [
            { title: `${recognizedObject.name} - Basic Model`, price: '$29.99', link: 'https://example.com/basic-gadget' },
            { title: `${recognizedObject.name} - Pro Version`, price: '$49.99', link: 'https://example.com/pro-gadget' },
            { title: `${recognizedObject.name} - Premium Edition`, price: '$79.99', link: 'https://example.com/premium-gadget' },
            { title: `${recognizedObject.name} - Entry Level`, price: '$24.50', link: 'https://example.com/entry-level' },
        ];

        // Sort products by price (low to high). This requires parsing prices.
        // This sorting assumes prices are simple strings like '$XX.YY'
        const sortedProducts = products.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g,""));
            const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g,""));
            return priceA - priceB;
        });

        // Send back the results
        res.json({
            objectName: recognizedObject.name,
            accuracy: recognizedObject.confidence,
            products: sortedProducts,
        });

    } catch (error) {
        console.error('Error during scan process:', error);
        res.status(500).json({ error: 'Failed to process image or find products.', details: error.message });
    } finally {
        // Clean up the uploaded image file after processing
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting temporary image file:', err);
            });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Frontend accessible at http://localhost:${port}/index.html`);
});
