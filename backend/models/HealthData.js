const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: String, required: true },
    steps: { type: Number, default: 0 },
    distance: { type: Number, default: 0 }, 
    sleep: { type: String, default: 'No Data' },
    heartRate: { type: Number, default: 0 },
    flights: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('HealthData', healthDataSchema);
