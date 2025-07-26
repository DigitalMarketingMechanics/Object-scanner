document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const previewImage = document.getElementById('previewImage');
    const previewText = document.querySelector('.preview-text');
    const scanButton = document.getElementById('scanButton');
    const objectName = document.getElementById('objectName');
    const accuracy = document.getElementById('accuracy');
    const productLinks = document.getElementById('productLinks');

    let selectedFile = null;

    imageUpload.addEventListener('change', (event) => {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewText.style.display = 'none';
                scanButton.disabled = false;
            };
            reader.readAsDataURL(selectedFile);
        } else {
            previewImage.src = '#';
            previewImage.style.display = 'none';
            previewText.style.display = 'block';
            scanButton.disabled = true;
            objectName.textContent = 'Object: N/A';
            accuracy.textContent = 'Accuracy: N/A';
            productLinks.innerHTML = '<li>No products found yet.</li>';
        }
    });

    scanButton.addEventListener('click', async () => {
        if (!selectedFile) {
            alert('Please select an image first.');
            return;
        }

        scanButton.disabled = true;
        scanButton.textContent = 'Scanning...';
        objectName.textContent = 'Object: Scanning...';
        accuracy.textContent = 'Accuracy: ...';
        productLinks.innerHTML = '<li>Searching for products...</li>';

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('/scan', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const data = await response.json();
            console.log(data); // Log the full response

            objectName.textContent = `Object: ${data.objectName || 'Unknown'}`;
            accuracy.textContent = `Accuracy: ${(data.accuracy * 100).toFixed(2)}%`;

            productLinks.innerHTML = ''; // Clear previous links
            if (data.products && data.products.length > 0) {
                data.products.forEach(product => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <a href="${product.link}" target="_blank" rel="noopener noreferrer">${product.title}</a>
                        <span class="price">${product.price}</span>
                    `;
                    productLinks.appendChild(listItem);
                });
            } else {
                productLinks.innerHTML = '<li>No online store links found for this object.</li>';
            }

        } catch (error) {
            console.error('Scan failed:', error);
            objectName.textContent = 'Object: Error during scan';
            accuracy.textContent = 'Accuracy: Please try again.';
            productLinks.innerHTML = `<li>Error: ${error.message}. Please try again.</li>`;
        } finally {
            scanButton.disabled = false;
            scanButton.textContent = 'Scan Object';
        }
    });
});
