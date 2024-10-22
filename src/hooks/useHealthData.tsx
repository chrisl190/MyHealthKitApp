import { useState, useEffect } from 'react';
import AppleHealthKit from 'react-native-health';

export const useHealthData = () => {
    const [healthData, setHealthData] = useState({ steps: null, distance: null, sleep: null, heartRate: null, flights: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHealthData = async () => {
        try {
            const options = { startDate: new Date(2021, 0, 1).toISOString() };
            const sleepOptions = { startDate: new Date(2021, 0, 1).toISOString(), endDate: new Date().toISOString() };

            AppleHealthKit.getStepCount(options, (err, result) => {
                if (err) throw new Error('Error fetching steps');
                setHealthData(prev => ({ ...prev, steps: result.value }));
            });

            AppleHealthKit.getDistanceWalkingRunning(options, (err, result) => {
                if (err) throw new Error('Error fetching distance');
                setHealthData(prev => ({ ...prev, distance: result.value / 1000 }));
            });

            AppleHealthKit.getHeartRateSamples(options, (err, results) => {
                if (err) throw new Error('Error fetching heart rate');
                if (results && results.length > 0) {
                    setHealthData(prev => ({ ...prev, heartRate: results[0].value }));
                }
            });

            AppleHealthKit.getSleepSamples(sleepOptions, (err, results) => {
                if (err) throw new Error('Error fetching sleep');
                if (results && results.length > 0) {
                    const inBedSamples = results.filter(sample => sample.value === 'INBED');
                    if (inBedSamples.length > 0) {
                        const lastInBedSample = inBedSamples[inBedSamples.length - 1];
                        const sleepStart = new Date(lastInBedSample.startDate);
                        const sleepEnd = new Date(lastInBedSample.endDate);

                        const sleepDurationMs = sleepEnd.getTime() - sleepStart.getTime();
                        const hours = Math.floor(sleepDurationMs / (1000 * 60 * 60));
                        const minutes = Math.floor((sleepDurationMs % (1000 * 60 * 60)) / (1000 * 60));

                        const sleepDuration = `${hours} hr ${minutes} min`;
                        setHealthData(prev => ({ ...prev, sleep: sleepDuration }));
                    } else {
                        setHealthData(prev => ({ ...prev, sleep: 'No Data' }));
                    }
                } else {
                    setHealthData(prev => ({ ...prev, sleep: 'No Data' }));
                }
            });

            AppleHealthKit.getFlightsClimbed(options, (err, result) => {
                if (err) throw new Error('Error fetching flights');
                setHealthData(prev => ({ ...prev, flights: result.value }));
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthData();
    }, []);

    return { healthData, isLoading, error, fetchHealthData };
};
