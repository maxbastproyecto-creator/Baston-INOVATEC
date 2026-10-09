const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/sentinela');

const Alerta = mongoose.model('Alerta', {
  tipo: String, lat: Number, lng: Number,
  fecha: { type: Date, default: Date.now }
});

app.get('/api/health', (req, res) => res.json({ ok: true, hora: new Date() }));
app.post('/api/alertas', async (req, res) => res.json(await Alerta.create(req.body)));
app.get('/api/alertas', async (req, res) => res.json(await Alerta.find().sort({ fecha: -1 }).limit(20)));

app.listen(3000, '0.0.0.0', () => console.log('API en :3000'));
