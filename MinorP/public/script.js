let map;
let drawingManager;
let selectedRegion = null;

function initMap() {
    // Initialize Google Map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India (change if needed)
        zoom: 5
    });

    // Drawing manager for creating rectangles
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        markerOptions: { draggable: true },
        polygonOptions: { editable: true, draggable: true },
        rectangleOptions: { editable: true, draggable: true }
    });
    drawingManager.setMap(map);

    // Event listener for drawing a rectangle
    google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
        selectedRegion = rectangle;
        document.getElementById('classifyButton').disabled = false; // Enable classify button
    });

    // Disable classify button initially
    document.getElementById('classifyButton').disabled = true;

    // Handle draw button click
    document.getElementById('drawButton').addEventListener('click', function() {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
    });

    // Handle classify button click
    document.getElementById('classifyButton').addEventListener('click', function() {
        if (selectedRegion) {
            const bounds = selectedRegion.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            // Send the selected region coordinates to the backend for classification
            fetch('/classify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    swLat: sw.lat(),
                    swLng: sw.lng(),
                    neLat: ne.lat(),
                    neLng: ne.lng()
                })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').innerText = `Classification Result: ${data.result}`;
            })
            .catch(error => console.error('Error:', error));
        }
    });
}
