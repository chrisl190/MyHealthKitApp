import React, { useState } from 'react';
import { ScrollView, StyleSheet, StatusBar, RefreshControl, Text, TouchableOpacity, Alert } from 'react-native';
import HealthCard from './HealthCard';
import { useHealthData } from '../../hooks/useHealthData';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import colours from '../../styles/colours';
import spacing from '../../styles/spacing';
import { updateHealthData, fetchWeeklyData, deleteHealthData } from '../../api/healthApi'; 
import HealthHistory from './HealthHistory';

const HealthKit: React.FC = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [weeklyData, setWeeklyData] = useState(null);
    const { healthData, isLoading, error, fetchHealthData } = useHealthData();
    const { user, signOut } = useAuthenticator();

    const handleSaveHealthData = async () => {
        const userId = user.userId;

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const todayHealthData = {
            userId,
            date: formattedDate,
            steps: healthData.steps,
            distance: healthData.distance,
            sleep: healthData.sleep,
            heartRate: healthData.heartRate,
            flights: healthData.flights,
        };

        console.log('Health data to be saved or updated:', JSON.stringify(todayHealthData));

        try {
            const response = await updateHealthData(userId, todayHealthData);
            console.log('Health data saved or updated successfully:', response);
        } catch (error) {
            console.error('Failed to save or update health data:', error);
            Alert.alert('Error', 'Failed to save or update health data');
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchHealthData();
            await handleSaveHealthData();
        } catch (error) {
            console.error('Error during refresh:', error);
            Alert.alert('Error', 'Failed to refresh health data');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleFetchMetricData = async (metric) => {
        const userId = user.userId;
        try {
            const data = await fetchWeeklyData(userId);
            const filteredData = data.map(entry => ({
                date: entry.date,
                value: entry[metric],
            })).slice(0, 5);
            setWeeklyData({ metric, data: filteredData });
        } catch (error) {
            console.error(`Error fetching ${metric} data:`, error);
            Alert.alert('Error', `Failed to fetch ${metric} data`);
        }
    };

    const handleDeleteHealthData = async (date) => {
        const userId = user.userId;
        try {
            await deleteHealthData(userId, date);
            Alert.alert('Success', `Health data for ${date} deleted successfully`);
            await handleFetchMetricData(weeklyData.metric);
        } catch (error) {
            console.error('Failed to delete health data:', error);
            Alert.alert('Error', `Failed to delete health data for ${date}`);
        }
    };

    const formatNumberWithCommas = (number) => {
        return number ? number.toLocaleString() : 'No Data';
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

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
                    value={formatNumberWithCommas(healthData.steps)}
                    unit="steps"
                    time={getCurrentTime()}
                    iconName="walk-outline"
                    onPress={() => handleFetchMetricData('steps')}
                />
                
                <HealthCard
                    title="Walking + Running Distance"
                    value={healthData.distance ? healthData.distance.toFixed(2) : 'No Data'}
                    unit="km"
                    time={getCurrentTime()}
                    iconName="footsteps-outline"
                    onPress={() => handleFetchMetricData('distance')}
                />
                
                <HealthCard
                    title="Heart Rate"
                    value={healthData.heartRate ? healthData.heartRate.toFixed(2) : 'No Data'}
                    unit="bpm"
                    time={getCurrentTime()}
                    iconName="heart-outline"
                    onPress={() => handleFetchMetricData('heartRate')}
                />
                
                <HealthCard
                    title="Sleep"
                    value={healthData.sleep || 'No Data'}
                    time={getCurrentTime()}
                    iconName="bed-outline"
                    onPress={() => handleFetchMetricData('sleep')}
                />
                
                <HealthCard
                    title="Flights Climbed"
                    value={formatNumberWithCommas(healthData.flights)}
                    time={getCurrentTime()}
                    iconName="barbell-outline"
                    onPress={() => handleFetchMetricData('flights')}
                />

                {weeklyData && (
                    <HealthHistory
                        metric={weeklyData.metric}
                        data={weeklyData.data}
                        onDelete={handleDeleteHealthData}
                    />
                )}

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
        color: colours.black,
    },
    greetingSub: {
        fontSize: 16,
        marginBottom: 20,
        fontWeight: 'bold',
        color: colours.black,
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
        textAlign: 'center',
    },
});

export default HealthKit;
