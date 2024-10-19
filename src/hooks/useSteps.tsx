import { useState, useEffect } from 'react';
import AppleHealthKit from 'react-native-health';

export const useSteps = () => {
    const [steps, setSteps] = useState<number | null>(null);

    const fetchSteps = async () => {
        try {
            const options = {
                startDate: new Date(2021, 0, 1).toISOString(),
            };
            AppleHealthKit.getStepCount(options, (err: Object, result: { value: number }) => {
                if (err) {
                    setSteps(null);
                    return;
                }
                setSteps(result.value);
            });
        } catch (error) {
            console.error('Error in useSteps hook:', error);
        }
    };

    useEffect(() => {
        fetchSteps();
    }, []);

    return [steps, fetchSteps];
};
