document.addEventListener('DOMContentLoaded', () => {
    const uploadImageInput = document.getElementById('uploadImage');
    const resetBackgroundButton = document.getElementById('resetBackground');
    const imageOptions = document.querySelectorAll('.image-option');

    function setBackgroundImage(imageUrl) {
        chrome.storage.local.set({ newTabImage: imageUrl }, () => {
            const error = chrome.runtime.lastError;
            if (error) {
                console.error('Error:', error.message);
                if (error.message.includes('QUOTA_BYTES')) {
                    alert('Limit exceeded. Please select a smaller image.');
                }
            } else {
                alert('The tab background is set.');
                chrome.runtime.sendMessage({ action: 'updateBackground' });
            }
        });
    }

    imageOptions.forEach(img => {
        img.addEventListener('click', () => {
            const fullImageUrl = img.getAttribute('data-full');
            setBackgroundImage(fullImageUrl);
        });
    });

    uploadImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('The file is too large. Please select an image smaller than 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setBackgroundImage(reader.result);
            };

            reader.readAsDataURL(file);
        }
    });

    resetBackgroundButton.addEventListener('click', () => {
        chrome.storage.local.remove('newTabImage', () => {
            const error = chrome.runtime.lastError;
            if (error) {
                console.error('Error:', error.message);
            } else {
                chrome.storage.local.set({ newTabImage: '' }, () => {
                    alert('The tab background has been reset.');
                    chrome.runtime.sendMessage({ action: 'updateBackground' });
                });
            }
        });
    });

    document.body.classList.add('visible');
});
