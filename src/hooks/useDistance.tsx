import { useState, useEffect } from 'react';
import AppleHealthKit from 'react-native-health';

export const useDistance = () => {
    const [distance, setDistance] = useState<number | null>(null);

    const fetchDistance = async () => {
        try {
            const options = {
                startDate: new Date(2021, 0, 1).toISOString(),
            };
            AppleHealthKit.getDistanceWalkingRunning(options, (err: Object, result: { value: number }) => {
                if (err) {
                    setDistance(null);
                    return;
                }
                setDistance(result.value / 1000);
            });
        } catch (error) {
            console.error('Error in useDistance hook:', error);
        }
    };

    useEffect(() => {
        fetchDistance();
    }, []);

    return [distance, fetchDistance];
};
