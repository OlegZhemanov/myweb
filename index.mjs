import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(import.meta.url).split('/').slice(0, -1).join('/');

export const handler = async (event) => {
    try {
        // Get the path from the request
        let requestPath = event.path || '/';
        if (requestPath === '/') {
            requestPath = 'index.html';
        }

        // Remove leading slash for file system path
        const fsPath = requestPath.startsWith('/') ? requestPath.slice(1) : requestPath;

        // Serve files from the public directory
        const filePath = join(__dirname, 'public', fsPath);
        console.log('Attempting to read file:', filePath);
        
        const fileContent = await readFile(filePath, 'utf-8');
        
        // Set appropriate content type based on file extension
        const contentType = requestPath.endsWith('.html') ? 'text/html' : 
                          requestPath.endsWith('.css') ? 'text/css' : 
                          requestPath.endsWith('.js') ? 'text/javascript' : 
                          'text/plain';

        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            },
            body: fileContent
        };
    } catch (error) {
        console.error('Error serving file:', error);
        return {
            statusCode: error.code === 'ENOENT' ? 404 : 500,
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            },
            body: error.code === 'ENOENT' ? 'Not Found' : 'Internal Server Error'
        };
    }
};