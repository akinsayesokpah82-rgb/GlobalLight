require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const cron = require('node-cron');

const openaiRoutes = require('./routes/openai');
const motivationalRoutes = require('./routes/motivational');
const wassceRoutes = require('./routes/wassce');
const smsRoutes = require('./routes/sms');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/openai', openaiRoutes);
app.use('/api/motivational', motivationalRoutes);
app.use('/api/wassce', wassceRoutes);
app.use('/api/sms', smsRoutes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected to websocket');
  ws.on('message', (msg) => { console.log('ws message', msg.toString()); });
  ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to Global Light realtime channel' }));
});

// motivational scheduler: every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  // generate or pick a motivational quote
  const quote = await require('./routes/motivational').generateQuote();
  // broadcast to connected websocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify({ type: 'motivational', quote }));
  });
  console.log('Broadcasted motivational quote:', quote.text || quote);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log('Backend running on', PORT));
