import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const server = createServer(async (req, res) => {
    if (req.url === '/') {
        try {
            const html = await readFile(join(__dirname, 'public', 'index.html'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error loading page:', error);
            res.writeHead(500);
            res.end('Error loading page');
        }
    } else {
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