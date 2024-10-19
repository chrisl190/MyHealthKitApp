import { useState, useEffect } from 'react';
import AppleHealthKit from 'react-native-health';

export const useFlights = () => {
    const [flights, setFlights] = useState<number | null>(null);

    const fetchFlights = async () => {
        try {
            const options = {
                startDate: new Date().toISOString(),
            };

            AppleHealthKit.getFlightsClimbed(options, (err: Object, result: { value: number }) => {
                if (err) {
                    setFlights(null);
                    return;
                }

                if (result && typeof result.value === 'number') {
                    setFlights(result.value);
                    console.log(`Fetched Flights Climbed: ${result.value}`);
                } else {
                    setFlights(null);
                }
            });
        } catch (error) {
            console.error('Error in useFlights hook:', error);
        }
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    return [flights, fetchFlights];
};
