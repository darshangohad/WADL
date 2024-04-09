const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const directoryPath = path.join(__dirname, 'files');

app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to list files
app.get('/files', (req, res) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.send(files);
    });
});

// Endpoint to read file content
app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(directoryPath, filename);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }

        // Determine content type based on file extension
        const contentType = getContentType(filePath);

        // Set appropriate content type header
        res.setHeader('Content-Type', contentType);

        res.send(data);
    });
});

// Function to determine content type based on file extension
function getContentType(filePath) {
    const ext = path.extname(filePath);
    switch (ext.toLowerCase()) {
        case '.txt':
            return 'text/plain';
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'application/javascript';
        case '.json':
            return 'application/json';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        default:
            return 'application/octet-stream'; // Default to binary data
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
