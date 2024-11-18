const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Endpoint for classifying the selected region
app.post('/classify', (req, res) => {
    const { swLat, swLng, neLat, neLng } = req.body;

    // Simulate downloading satellite imagery based on coordinates (using Google Static Maps API or another service)
    // For now, we just pass the coordinates to the Python script.

    const pythonProcess = spawn('python', ['server/classify.py', swLat, swLng, neLat, neLng]);

    pythonProcess.stdout.on('data', (data) => {
        const result = data.toString();
        res.json({ result: result });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            res.status(500).send('Error in classification');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
