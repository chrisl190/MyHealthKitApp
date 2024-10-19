import { useState, useEffect } from 'react';
import AppleHealthKit from 'react-native-health';

export const useHeartRate = () => {
    const [heartRate, setHeartRate] = useState<number | null>(null);

    const fetchHeartRate = async () => {
        try {
            const options = {
                unit: 'bpm',
                startDate: new Date(2021, 0, 1).toISOString(),
                endDate: new Date().toISOString(),
                ascending: false,
                limit: 10,
            };

            AppleHealthKit.getHeartRateSamples(options, (err: Object, results: any[]) => {
                if (err) {
                    setHeartRate(null);
                    return;
                }

                if (results && results.length > 0) {
                    const latestHeartRate = Math.round(results[0].value);
                    setHeartRate(latestHeartRate);
                    console.log(`Fetched Heart Rate: ${latestHeartRate} bpm`);
                } else {
                    setHeartRate(null);
                }
            });
        } catch (error) {
            console.error('Error in useHeartRate hook:', error);
        }
    };

    useEffect(() => {
        fetchHeartRate();
    }, []);

    return [heartRate, fetchHeartRate];
};
