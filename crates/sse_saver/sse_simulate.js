const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// SSE endpoint
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');


    fs.readFile('events.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Dosya okuma hatası:', err);
            res.status(500).end();
            return;
        }

        try {
            const events = JSON.parse(data);
            events.forEach((event, index) => {
                setTimeout(() => {
                    res.write(`
                        event:${JSON.stringify(event.event)}\n`);
                    res.write(`data:${JSON.stringify(event.data)}\n\n`);
                }, index * 1000); ""
            });

        } catch (parseError) {
            console.error('JSON parse hatası:', parseError);
            res.status(500).end();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
