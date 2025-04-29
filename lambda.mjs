import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const handler = async (event) => {
    try {
        // Read the HTML file
        const html = await readFile(join(__dirname, 'public', 'index.html'), 'utf-8');

        // Return the response in Lambda format
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            },
            body: html
        };
    } catch (error) {
        console.error('Error loading page:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            },
            body: 'Error loading page'
        };
    }
}; 