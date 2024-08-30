document.addEventListener('DOMContentLoaded', () => {
    function setBackgroundImage(imageUrl) {
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.opacity = 1;
    }

    chrome.storage.local.get('newTabImage', (data) => {
        if (data.newTabImage) {
            const img = new Image();
            img.src = data.newTabImage;
            img.onload = () => setBackgroundImage(data.newTabImage);
            img.onerror = () => document.body.style.opacity = 1;
        } else {
            document.body.style.opacity = 1;
        }
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.newTabImage) {
            const newImage = changes.newTabImage.newValue;
            if (newImage) {
                const img = new Image();
                img.src = newImage;
                img.onload = () => setBackgroundImage(newImage);
                img.onerror = () => document.body.style.backgroundImage = '';
            } else {
                document.body.style.backgroundImage = '';
            }
        }
    });

    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const query = searchBox.value.trim();
                if (query) {
                    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});
