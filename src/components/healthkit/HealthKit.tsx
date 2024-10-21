import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, StatusBar, RefreshControl, Alert, Text, TouchableOpacity } from 'react-native';
import HealthCard from './HealthCard';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { useSteps } from '../../hooks/useSteps';
import { useDistance } from '../../hooks/useDistance';
import { useSleep } from '../../hooks/useSleep';
import { useHeartRate } from '../../hooks/useHeartRate';
import { useFlights } from '../../hooks/useFlights';
import colours from '../../styles/colours';
import spacing from '../../styles/spacing';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const permissions: HealthKitPermissions = {
    permissions: {
        read: ['StepCount', 'DistanceWalkingRunning', 'HeartRate', 'FlightsClimbed', 'ActiveEnergyBurned', 'SleepAnalysis'],
    },
};

const HealthKit: React.FC = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [steps, fetchSteps] = useSteps();
    const [distance, fetchDistance] = useDistance();
    const [sleep, fetchSleep] = useSleep();
    const [heartRate, fetchHeartRate] = useHeartRate();
    const [flights, fetchFlights] = useFlights();
    const { user, signOut } = useAuthenticator();

    const requestPermissions = async () => {
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(permissions, (error: string) => {
                if (error) {
                    Alert.alert(
                        'Permission Denied',
                        'HealthKit permissions were not granted. Please enable them in your device settings.',
                        [{ text: 'OK' }]
                    );
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await requestPermissions();

            await Promise.all([
                fetchSteps(),
                fetchDistance(),
                fetchSleep(),
                fetchHeartRate(),
                fetchFlights(),
            ]);
        } catch (error) {
            console.error('Error fetching data on refresh:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatNumberWithCommas = (number: number) => {
        return number.toLocaleString();
    };

    useEffect(() => {
        handleRefresh();
    }, []);

    return (
        <>
            <StatusBar barStyle="light-content" />
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colours.blue}
                    />
                }
            >
                <Text style={styles.greeting}>Hello,</Text>
                <Text style={styles.greetingSub}>{user?.signInDetails?.loginId || 'User'}</Text>
                <HealthCard
                    title="Steps"
                    value={steps ? formatNumberWithCommas(steps) : 'No Data'}
                    unit="steps"
                    time={getCurrentTime()}
                    iconName="walk-outline"
                />
                <HealthCard
                    title="Walking + Running Distance"
                    value={distance ? distance.toFixed(2) : 'No Data'}
                    unit="km"
                    time={getCurrentTime()}
                    iconName="footsteps-outline"
                />
                <HealthCard
                    title="Heart Rate"
                    value={heartRate ? heartRate.toFixed(2) : 'No Data'}
                    unit="bpm"
                    time={getCurrentTime()}
                    iconName="heart-outline"
                />
                <HealthCard
                    title="Sleep"
                    value={sleep ? sleep : 'No Data'}
                    unit=""
                    time={getCurrentTime()}
                    iconName="bed-outline"
                />
                <HealthCard
                    title="Flights Climbed"
                    value={flights ? flights : 'No Data'}
                    time={getCurrentTime()}
                    iconName="barbell-outline"
                />
                <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
                    <Text style={styles.signOutButtonText}>Sign out</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colours.background,
        paddingVertical: spacing.paddingLarge,
        paddingHorizontal: spacing.paddingMedium,
    },
    greeting: {
        fontSize: 24,
        marginBottom: 5,
        marginTop: 5,
        fontWeight: 'bold',
        color: Colors.black,
    },
    greetingSub: {
        fontSize: 16,
        marginBottom: 20,
        fontWeight: 'bold',
        color: Colors.black,
    },
    signOutButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colours.blue,
        borderRadius: 5,
    },
    signOutButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

export default HealthKit;
