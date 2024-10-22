import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import colours from '../../styles/colours';

const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
};

const HealthHistory = ({ metric, data, onDelete }) => {
    const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>
                Last 5 days of {metric}
            </Text>
            {sortedData.map((entry, index) => (
                <View key={index} style={styles.historyEntry}>
                    <Text>{formatDate(entry.date)}</Text>
                    <Text>{entry.value}</Text>
                    <TouchableOpacity 
                        onPress={() => 
                            Alert.alert(
                                'Delete Entry', 
                                `Are you sure you want to delete data for ${formatDate(entry.date)}?`, 
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Delete', onPress: () => onDelete(entry.date) }
                                ]
                            )
                        } 
                        style={styles.deleteButton}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    historyContainer: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colours.cardBackground,
        borderRadius: 5,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    historyEntry: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    deleteButton: {
        padding: 5,
        backgroundColor: colours.errorBackground,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#D64958',
        fontWeight: 'bold',
    },
});

export default HealthHistory;
