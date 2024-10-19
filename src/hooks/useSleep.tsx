import { useState, useEffect } from 'react';
import AppleHealthKit from 'react-native-health';

export const useSleep = () => {
    const [sleep, setSleep] = useState<string | null>(null);

    const fetchSleep = async () => {
        try {
            const options = {
                startDate: new Date(2021, 0, 1).toISOString(),
                endDate: new Date().toISOString(),
                limit: 10,
                ascending: true,
            };

            AppleHealthKit.getSleepSamples(options, (err: Object, results: any[]) => {
                if (err) {
                    setSleep('No Data');
                    return;
                }

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
                        setSleep(sleepDuration);
                        console.log(`Fetched Sleep: ${sleepDuration}`);
                    } else {
                        setSleep('No Data');
                    }
                } else {
                    setSleep('No Data');
                }
            });
        } catch (error) {
            console.error('Error in useSleep hook:', error);
        }
    };

    useEffect(() => {
        fetchSleep();
    }, []);

    return [sleep, fetchSleep];
};
