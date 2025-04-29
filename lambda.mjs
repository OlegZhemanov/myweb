import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const handler = async (event) => {
    try {
        // Get the path from the request
        let path = event.path;
        if (path === '/') {
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
            statusCode: 404,
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            },
            body: 'Not Found'
        };
    }
}; 