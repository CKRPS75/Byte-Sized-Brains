const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Parser } = require('json2csv');

const app = express();
app.use(cors()); 
app.use(express.json());

const mongoURI = "mongodb+srv://CKRPS75:CKRPS%4075@cluster75.iy5v1jb.mongodb.net/?appName=Cluster75"; 

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ Connection Error:", err));

const LogSchema = new mongoose.Schema({ 
    temperature: Number, 
    humidity: Number, 
    soil: Number, 
    light: Number, 
    time: { type: Date, default: Date.now } 
});

const ConfigSchema = new mongoose.Schema({
    tempLimit: { type: Number, default: 30 },
    soilLimit: { type: Number, default: 30 },
    sunlightLimit: { type: Number, default: 50 },
    humidityLimit: { type: Number, default: 50 },
    override: { type: Boolean, default: false }, 
    fanStatus: { type: Boolean, default: false },
    pumpStatus: { type: Boolean, default: false },
    misterStatus: { type: Boolean, default: false },
    lightStatus: { type: Boolean, default: false }
});

const Log = mongoose.model('Log', LogSchema);
const Config = mongoose.model('Config', ConfigSchema);

// 1. Get Latest Data - FIXED MAPPING
app.get('/api/latest', async (req, res) => {
    try {
        const latestLog = await Log.findOne().sort({ time: -1 });
        let settings = await Config.findOne() || await Config.create({});
        
        res.status(200).json({ 
            sensors: {
                temperature: latestLog?.temperature || 0,
                humidity: latestLog?.humidity || 0, // Simplified: Match ESP32 names
                soil: latestLog?.soil || 0,         // Simplified: Match ESP32 names
                light: latestLog?.light || 0,       // Simplified: Match ESP32 names
                timestamp: latestLog?.time || Date.now()
            }, 
            config: settings 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sync', async (req, res) => {
    try {
        const newLog = new Log(req.body);
        await newLog.save(); 
        let settings = await Config.findOne() || await Config.create({});
        res.status(200).json({ config: settings }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/config', async (req, res) => {
    try {
        const updated = await Config.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is LIVE on http://10.145.71.44:5050`);
});