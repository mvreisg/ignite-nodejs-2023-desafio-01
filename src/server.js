import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { Database } from './database.js';

const database = new Database();

const server = http.createServer(async (req, res) => {     
    const buffers = [];

    for await (const buffer of req){
        buffers.push(JSON.parse(String(buffer)));
    }
    
    req.body = buffers.flat()[0];

    if (req.method === 'POST' && req.url.includes('/tasks')){
        const { title, description } = req.body;

        const obj = {
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        };

        database.create('tasks', obj);

        res.writeHead(201).end(JSON.stringify(obj));  
        return;
    }

    if (req.method === 'GET' && req.url.includes('/tasks')){
        const data = database.select('tasks');

        res.writeHead(200).end(JSON.stringify(data));
        return;
    }

    if (req.method === 'PUT' && req.url.includes('/tasks')){
        const id = req.url.substring(7);
        console.log(id);
        const { title, description } = req.body;
        
        database.update('tasks', id, { title, description });

        res.writeHead(204).end();  
        return;
    }

    if (req.method === 'DELETE' && req.url.includes('/tasks')){
        const id = req.url.substring(7);
        
        database.delete('tasks', id);

        res.writeHead(204).end();
        return;
    }

    if (req.method === 'PATCH' && req.url.includes('/tasks/complete/')){
        const id = req.url.substring(16);
        
        database.complete('tasks', id);

        res.writeHead(204).end();
        return;
    }
        
    res.writeHead(404).end('Rota não encontrada!');
});

server.listen(3333);