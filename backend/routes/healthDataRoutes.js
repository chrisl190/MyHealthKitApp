const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');

router.post('/save', async (req, res) => {
    const { userId, date, steps, distance, sleep, heartRate, flights } = req.body;

    if (!userId || !date) {
        return res.status(400).json({ error: 'User ID and date are required' });
    }


    try {
        const existingData = await HealthData.findOne({ userId, date });
        if (existingData) {
            return res.status(409).json({ error: 'Health data already exists for this date' });
        }

        const newHealthData = new HealthData({
            userId,
            date,
            steps,
            distance,
            sleep,
            heartRate,
            flights,
        });

        const savedData = await newHealthData.save();
        return res.status(201).json(savedData);
    } catch (err) {
        console.error('Error saving health data:', err);
        return res.status(500).json({ error: 'Failed to save health data' });
    }
});

router.get('/:userId/week', async (req, res) => {
    const { userId } = req.params;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    try {
        const weeklyData = await HealthData.find({
            userId,
            date: { $gte: startDate.toISOString() },
        });
        return res.json(weeklyData);
    } catch (err) {
        console.error('Error fetching weekly health data:', err);
        return res.status(500).json({ error: 'Failed to fetch weekly health data' });
    }
});

router.delete('/:userId/:date', async (req, res) => {
    const { userId, date } = req.params;

    try {
        const deletedData = await HealthData.findOneAndDelete({ userId, date });
        if (!deletedData) {
            return res.status(404).json({ error: 'No health data found for this date' });
        }
        return res.json({ message: 'Health data deleted successfully' });
    } catch (err) {
        console.error('Error deleting health data:', err);
        return res.status(500).json({ error: 'Failed to delete health data' });
    }
});

router.put('/update', async (req, res) => {
    const { userId, date, steps, distance, sleep, heartRate, flights } = req.body;

    if (!userId || !date) {
        return res.status(400).json({ error: 'User ID and date are required' });
    }

    try {
        const updatedData = await HealthData.findOneAndUpdate(
            { userId, date },
            { steps, distance, sleep, heartRate, flights },
            { new: true, upsert: true }
        );

        return res.json(updatedData);
    } catch (err) {
        console.error('Error updating health data:', err);
        return res.status(500).json({ error: 'Failed to update health data' });
    }
});


module.exports = router;
