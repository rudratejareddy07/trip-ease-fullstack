document.addEventListener('DOMContentLoaded', function() {
    // Wait a brief moment to ensure all elements are fully loaded
    setTimeout(initializeMap, 100);
});

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map container not found');
        return;
    }

    const lat = parseFloat(mapElement.dataset.lat);
    const lng = parseFloat(mapElement.dataset.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid latitude or longitude values');
        return;
    }

    try {
        const map = L.map('map').setView([lat, lng], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>${mapElement.dataset.title || 'Location'}</b><br>${mapElement.dataset.location || ''}`)
            .openPopup();
            
        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}