import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const server = createServer(async (req, res) => {
    try {
        // Remove query parameters and trailing slashes
        let path = req.url.split('?')[0];
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // Default to index.html for root path
        if (path === '') {
            path = '/index.html';
        }

        // Serve files from the public directory
        const filePath = join(__dirname, 'public', path);
        const fileContent = await readFile(filePath, 'utf-8');
        
        // Set appropriate content type based on file extension
        const contentType = path.endsWith('.html') ? 'text/html' : 
                          path.endsWith('.css') ? 'text/css' : 
                          path.endsWith('.js') ? 'text/javascript' : 
                          'text/plain';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fileContent);
    } catch (error) {
        console.error('Error serving file:', error);
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Try different ports if 3000 is in use
const startServer = async (port = 3000) => {
    return new Promise((resolve, reject) => {
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use, trying port ${port + 1}`);
                startServer(port + 1).then(resolve).catch(reject);
            } else {
                reject(error);
            }
        });

        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
            resolve(port);
        });
    });
};

// Start the server
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
}); 